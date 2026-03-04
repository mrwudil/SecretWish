import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRoute } from "wouter";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import confetti from "canvas-confetti";
import { Gift, Plus, Trash2, CheckCircle2 } from "lucide-react";
import { Button, Card, Input } from "@/components/ui-elements";
import { useQuestion, useSubmitWishes } from "@/hooks/use-questions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  wishes: z.array(z.object({
    itemName: z.string().min(1, "Item name is required"),
    itemLink: z.string().optional().or(z.literal('')),
    price: z.coerce.number().optional().or(z.literal(0)),
  })).min(1).max(3),
});

type FormValues = z.infer<typeof formSchema>;

export default function Receiver() {
  const [, params] = useRoute("/r/:id");
  const id = params?.id || "";
  
  const { data: question, isLoading: isQuestionLoading } = useQuestion(id);
  const submitMutation = useSubmitWishes(id);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();

  const { register, control, handleSubmit, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      wishes: [{ itemName: "", itemLink: "", price: undefined }]
    }
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: "wishes"
  });

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const end = Date.now() + duration;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#FF6B6B', '#FF8E53', '#ffffff']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#FF6B6B', '#FF8E53', '#ffffff']
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    };
    frame();
  };

  const onSubmit = async (data: FormValues) => {
    try {
      await submitMutation.mutateAsync(data);
      setIsSuccess(true);
      triggerConfetti();
      toast({ title: "Wishes Sent!", description: "Your wishes have been delivered successfully." });
    } catch (err) {
      console.error(err);
      toast({ title: "Submission Failed", description: "There was an error sending your wishes. Please try again.", variant: "destructive" });
    }
  };

  if (isQuestionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
      </div>
    );
  }

  if (!question) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 text-center">
        <Card className="max-w-md w-full py-12">
          <div className="text-4xl mb-4">🕵️‍♂️</div>
          <h2 className="text-2xl font-bold mb-2">Link Not Found</h2>
          <p className="text-muted-foreground">This secret link doesn't exist or has expired.</p>
        </Card>
      </div>
    );
  }

  const hasSubmitted = question.wishes && question.wishes.length > 0;

  if (hasSubmitted || isSuccess) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
          <Card className="max-w-md w-full text-center py-12 px-8 border-2 border-green-100 bg-gradient-to-b from-white to-green-50/30">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
              <CheckCircle2 className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Wishes Locked In!</h2>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Your wishes have been sent anonymously. Someone is reviewing them right now 👀
            </p>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 w-full h-96 bg-gradient-to-b from-[#FF6B6B]/10 to-transparent -z-10" />
      
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-2xl text-center mb-10">
        <div className="w-16 h-16 bg-white shadow-xl rounded-2xl flex items-center justify-center mx-auto mb-6 rotate-12">
          <Gift className="w-8 h-8 text-[#FF6B6B]" />
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-foreground mb-4">
          Someone wants to get you a gift for your <span className="text-[#FF6B6B]">{question.eventType}</span>!
        </h1>
        <p className="text-lg text-muted-foreground">
          Drop up to 3 things you really want below. They won't know which one you wanted most, keeping it a surprise.
        </p>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="w-full max-w-2xl">
        <Card className="shadow-2xl shadow-black/5">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
            <AnimatePresence>
              {fields.map((field, index) => (
                <motion.div
                  key={field.id}
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="p-6 bg-black/[0.02] rounded-xl relative group border border-black/[0.05]"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-bold text-foreground">Wish #{index + 1}</h3>
                    {fields.length > 1 && (
                      <button 
                        type="button" 
                        onClick={() => remove(index)}
                        className="text-muted-foreground hover:text-red-500 transition-colors p-2 -mr-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  <div className="space-y-4">
                    <Input
                      label="What is it?"
                      placeholder="e.g. Sony WH-1000XM5 Headphones"
                      {...register(`wishes.${index}.itemName`)}
                      error={errors.wishes?.[index]?.itemName?.message}
                    />
                    
                    <div className="grid sm:grid-cols-2 gap-4">
                      <Input
                        label="Link (Optional)"
                        placeholder="https://amazon.com/..."
                        {...register(`wishes.${index}.itemLink`)}
                        error={errors.wishes?.[index]?.itemLink?.message}
                      />
                      <Input
                        label="Approx. Price (Optional)"
                        placeholder="350"
                        type="number"
                        {...register(`wishes.${index}.price`)}
                        error={errors.wishes?.[index]?.price?.message}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4 border-t border-black/5">
              {fields.length < 3 ? (
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => append({ itemName: "", itemLink: "", price: undefined })}
                  className="w-full sm:w-auto font-bold text-[#FF6B6B] hover:text-[#FF6B6B] hover:bg-[#FF6B6B]/10"
                >
                  <Plus className="w-4 h-4 mr-2 inline" /> Add another wish (max 3)
                </Button>
              ) : (
                <div className="text-sm font-medium text-muted-foreground">Maximum of 3 wishes reached.</div>
              )}
              
              <Button 
                type="submit" 
                size="lg" 
                disabled={submitMutation.isPending}
                className="w-full sm:w-auto min-w-[200px]"
              >
                {submitMutation.isPending ? "Sending..." : "Submit Wishes Securely"}
              </Button>
            </div>
          </form>
        </Card>
      </motion.div>
    </div>
  );
}
