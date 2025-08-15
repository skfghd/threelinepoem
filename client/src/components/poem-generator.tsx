import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { PoemResponse } from "@shared/schema";
import { Keyboard, Palette, WandSparkles, Laugh, Heart, Lightbulb, Star, Info } from "lucide-react";
import { isKoreanText } from "@/lib/korean-utils";

const formSchema = z.object({
  inputWord: z.string()
    .min(2, "최소 2글자 이상 입력해주세요")
    .max(5, "최대 5글자까지 입력 가능합니다")
    .refine(isKoreanText, "한글만 입력 가능합니다"),
  mood: z.enum(["funny", "warm", "creative", "poetic"])
});

type FormData = z.infer<typeof formSchema>;

interface PoemGeneratorProps {
  onPoemGenerated: (poem: PoemResponse) => void;
}

export function PoemGenerator({ onPoemGenerated }: PoemGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      inputWord: "",
      mood: "funny"
    }
  });

  const generatePoemMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const response = await apiRequest("POST", "/api/poems", data);
      return response.json() as Promise<PoemResponse>;
    },
    onSuccess: (poem) => {
      onPoemGenerated(poem);
      
      // 성공 토스트 메시지 (AI/Fallback 구분)
      if (poem.usedAI) {
        toast({
          title: "AI 삼행시가 생성되었습니다! 🎉",
          description: "제미나이 AI가 만든 새로운 창작물을 확인해보세요."
        });
      } else {
        toast({
          title: "삼행시가 생성되었습니다! 📝",
          description: poem.fallbackMessage || "규칙 기반으로 만든 창작물을 확인해보세요."
        });
      }
      
      form.reset({ inputWord: "", mood: "funny" });
    },
    onError: (error: any) => {
      toast({
        variant: "destructive",
        title: "생성 실패",
        description: error.message || "삼행시 생성 중 오류가 발생했습니다."
      });
    }
  });

  const onSubmit = async (data: FormData) => {
    setIsGenerating(true);
    try {
      await generatePoemMutation.mutateAsync(data);
    } finally {
      setIsGenerating(false);
    }
  };

  const inputWord = form.watch("inputWord");

  const moodOptions = [
    { value: "funny", label: "재미있게", icon: Laugh, description: "유머러스하고 웃긴" },
    { value: "warm", label: "따뜻하게", icon: Heart, description: "포근하고 사랑스러운" },
    { value: "creative", label: "창의적으로", icon: Lightbulb, description: "독창적이고 예술적인" },
    { value: "poetic", label: "시적으로", icon: Star, description: "서정적이고 아름다운" }
  ];

  return (
    <div className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 mb-8">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="inputWord"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-slate-700 flex items-center">
                  <Keyboard className="text-primary mr-2 w-5 h-5" />
                  단어나 이름을 입력해주세요
                </FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="예: 친구, 사랑, 행복..."
                      className="text-xl font-medium px-6 py-4 border-2 bg-slate-50 focus:bg-white rounded-xl"
                    />
                    <div className="absolute right-4 top-1/2 transform -translate-y-1/2">
                      <span className="text-slate-400 text-sm">
                        {inputWord.length}/10
                      </span>
                    </div>
                  </div>
                </FormControl>
                <p className="text-sm text-slate-500 flex items-center">
                  <Info className="w-4 h-4 mr-1" />
                  한글 2-5글자로 입력해주세요 • AI가 자연스러운 삼행시를 생성합니다
                </p>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="mood"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-lg font-semibold text-slate-700 flex items-center">
                  <Palette className="text-primary mr-2 w-5 h-5" />
                  시의 분위기 선택
                </FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    value={field.value}
                    className="grid grid-cols-2 md:grid-cols-4 gap-3"
                  >
                    {moodOptions.map((option) => (
                      <FormItem key={option.value} className="space-y-0">
                        <Label
                          htmlFor={option.value}
                          className={`p-4 border-2 rounded-xl text-center transition-all hover:border-slate-300 cursor-pointer block ${
                            field.value === option.value 
                              ? "border-primary bg-primary/5" 
                              : "border-slate-200"
                          }`}
                        >
                          <FormControl>
                            <RadioGroupItem
                              value={option.value}
                              id={option.value}
                              className="sr-only"
                            />
                          </FormControl>
                          <option.icon className={`w-6 h-6 mx-auto mb-2 ${
                            field.value === option.value 
                              ? "text-primary" 
                              : "text-slate-600"
                          }`} />
                          <span className="text-sm font-medium text-slate-700 block">
                            {option.label}
                          </span>
                        </Label>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            disabled={isGenerating}
            className="w-full gradient-primary text-white py-4 px-8 rounded-xl font-semibold text-lg hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            <WandSparkles className="mr-3 w-5 h-5" />
{isGenerating ? "AI가 생성 중..." : "AI로 삼행시 생성하기"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
