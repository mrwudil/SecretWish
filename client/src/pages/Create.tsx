import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { ArrowLeft, Link as LinkIcon, Copy, CheckCircle2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button, Card, Input, Select, RadioGroup } from "@/components/ui-elements";
import { useCreateQuestion } from "@/hooks/use-questions";
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  receiverEmail: z.string().min(1, "Email is required").email("Please enter a valid email address"),
  receiverName: z.string().optional(),
  eventType: z.string().min(1, "Event type is required"),
  revealOption: z.enum(["After Purchase", "Never"]),
});

type FormValues = z.infer<typeof formSchema>;

export default function Create() {
  const [createdLink, setCreatedLink] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();
  const createMutation = useCreateQuestion();

  const { register, handleSubmit, control, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      eventType: "Birthday",
      revealOption: "After Purchase",
    }
  });

  const onSubmit = async (data: FormValues) => {
    try {
      const res = await createMutation.mutateAsync(data);
      const link = `${window.location.origin}/r/${res.id}`;
      setCreatedLink(link);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create wish",
        variant: "destructive",
      });
    }
  };

  const copyLink = () => {
    if (createdLink) {
      navigator.clipboard.writeText(createdLink);
      setCopied(true);
      toast({ title: "Link copied to clipboard!" });
      setTimeout(() => setCopied(false), 3000);
    }
  };

  return (
    <div className="min-h-screen max-w-3xl mx-auto px-4 py-12">
      <Link href="/" className="inline-flex items-center text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Link>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-4xl font-extrabold text-foreground mb-2">Create Secret Wish</h1>
        <p className="text-lg text-muted-foreground mb-8">Generate a unique link to find out exactly what they want.</p>

        {createdLink ? (
          <Card className="bg-gradient-to-br from-white to-[#F7F7F7] border-2 border-[#FF6B6B]/20 text-center py-12">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-4">Link Created!</h2>
            <p className="text-muted-foreground mb-8 max-w-md mx-auto">
              Send this secure link to your recipient. They won't need an account to add their wishes.
            </p>
            
            <div className="flex items-center gap-2 max-w-lg mx-auto bg-black/5 p-2 rounded-lg border border-black/10">
              <div className="flex-1 overflow-hidden px-3 text-sm text-foreground/80 text-ellipsis whitespace-nowrap">
                {createdLink}
              </div>
              <Button onClick={copyLink} className="flex-shrink-0" size="sm">
                {copied ? <CheckCircle2 className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                {copied ? "Copied!" : "Copy Link"}
              </Button>
            </div>
            
            <div className="mt-8">
              <Link href="/">
                <Button variant="outline">Return to Dashboard</Button>
              </Link>
            </div>
          </Card>
        ) : (
          <Card>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <Input
                  label="Receiver's Email (For our notifications)"
                  placeholder="gift@example.com"
                  type="email"
                  {...register("receiverEmail")}
                  error={errors.receiverEmail?.message}
                />
                <Input
                  label="Receiver's First Name"
                  placeholder="Jane"
                  {...register("receiverName")}
                  error={errors.receiverName?.message}
                />
              </div>
              
              <div className="grid gap-6">
                <Select
                  label="Occasion / Event"
                  {...register("eventType")}
                  error={errors.eventType?.message}
                >
                  <option value="Birthday">Birthday</option>
                  <option value="Anniversary">Anniversary</option>
                  <option value="Christmas">Christmas</option>
                  <option value="Valentine's Day">Valentine's Day</option>
                  <option value="Graduation">Graduation</option>
                  <option value="Other">Other</option>
                </Select>
                
                <Controller
                  name="revealOption"
                  control={control}
                  render={({ field }) => (
                    <RadioGroup
                      label="When should they know who asked?"
                      options={[
                        { label: "After I pick a gift", value: "After Purchase" },
                        { label: "Keep it completely secret", value: "Never" }
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      error={errors.revealOption?.message}
                    />
                  )}
                />
              </div>

              <div className="pt-4 border-t border-black/5 flex justify-end">
                <Button 
                  type="submit" 
                  size="lg" 
                  disabled={createMutation.isPending}
                  className="w-full sm:w-auto"
                >
                  {createMutation.isPending ? "Generating..." : "Generate Secure Link"}
                  {!createMutation.isPending && <LinkIcon className="w-4 h-4 ml-2 inline" />}
                </Button>
              </div>
            </form>
          </Card>
        )}
      </motion.div>
    </div>
  );
}
