import { motion } from "framer-motion";
import { Link } from "wouter";
import { Plus, Gift, Clock, ExternalLink, Sparkles, Trash2 } from "lucide-react";
import { Button, Card } from "@/components/ui-elements";
import { useQuestions, useUpdateWishStatus } from "@/hooks/use-questions";
import { useAuth } from "@/hooks/use-auth";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { api, buildUrl } from "@shared/routes";
import { useToast } from "@/hooks/use-toast";

export default function Dashboard() {
  const { user } = useAuth();
  const { data: questions, isLoading } = useQuestions();
  const updateWish = useUpdateWishStatus();
  const { toast } = useToast();

  const deleteQuestion = async (id: string) => {
    if (!confirm("Are you sure you want to delete this secret wish?")) return;
    
    try {
      await apiRequest("DELETE", buildUrl(api.questions.delete.path, { id }));
      queryClient.invalidateQueries({ queryKey: ["/api/questions"] });
      toast({ title: "Deleted", description: "Secret wish removed successfully" });
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen max-w-5xl mx-auto px-4 sm:px-6 pb-24 pt-8">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
            Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
          </h1>
          <p className="text-muted-foreground">Manage your sent secret wishes and surprises.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <Link href="/create" className="inline-block">
            <Button className="flex items-center gap-2">
              <Plus className="w-5 h-5" />
              New Secret Wish
            </Button>
          </Link>
        </motion.div>
      </header>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FF6B6B]"></div>
        </div>
      ) : questions && questions.length > 0 ? (
        <div className="space-y-8">
          {questions.map((q, idx) => (
            <motion.div
              key={q.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
            >
              <Card className="overflow-hidden border-0 !p-0">
                <div className="bg-black/5 p-4 sm:p-6 border-b border-black/5 flex flex-wrap justify-between items-center gap-4">
                  <div className="flex-1 min-w-[200px]">
                    <div className="flex items-center gap-3 mb-1">
                      <span className="bg-white px-2 py-0.5 rounded-full text-[10px] font-bold text-[#FF6B6B] shadow-sm uppercase tracking-wide">
                        {q.eventType}
                      </span>
                      <span className="text-xs text-muted-foreground flex items-center gap-1">
                        <Clock className="w-3 h-3" /> 
                        {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold mt-1 text-balance">
                      For: {q.receiverName ? `${q.receiverName} (${q.receiverEmail})` : q.receiverEmail}
                    </h3>
                  </div>
                  <div className="flex gap-2 items-center flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border whitespace-nowrap ${
                      q.wishes && q.wishes.length > 0 
                        ? 'bg-green-50 text-green-600 border-green-100' 
                        : 'bg-amber-50 text-amber-600 border-amber-100'
                    }`}>
                      {q.wishes && q.wishes.length > 0 ? 'Wishes Received' : 'Waiting'}
                    </span>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => window.open(`/r/${q.id}`, '_blank')}
                      className="whitespace-nowrap flex items-center gap-1"
                    >
                      <ExternalLink className="w-3 h-3 flex-shrink-0" />
                      <span className="leading-none">View Link</span>
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => deleteQuestion(q.id)}
                      className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
                
                <div className="p-4 sm:p-6">
                  <h4 className="text-sm font-semibold text-foreground mb-3 opacity-70">Wishes</h4>
                  {q.wishes && q.wishes.length > 0 ? (
                    <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                      {q.wishes.map((wish) => (
                        <div key={wish.id} className="border border-black/5 rounded-lg p-3 bg-white shadow-sm flex flex-col justify-between group hover:border-[#FF6B6B]/30 transition-all">
                          <div>
                            <div className="flex justify-between items-start gap-2 mb-1">
                              <h5 className="font-bold text-sm leading-tight">{wish.itemName}</h5>
                              {wish.price && <span className="font-bold text-[10px] text-green-600 bg-green-50 px-1.5 py-0.5 rounded whitespace-nowrap">${wish.price}</span>}
                            </div>
                            {wish.itemLink && (
                              <a href={wish.itemLink} target="_blank" rel="noreferrer" className="text-blue-500 text-[11px] hover:underline flex items-center gap-1 mb-2">
                                <ExternalLink className="w-2.5 h-2.5" /> Link
                              </a>
                            )}
                          </div>
                          
                          {wish.status === 'pending' ? (
                            <div className="flex gap-1.5 mt-2 pt-2 border-t border-black/5">
                              <Button 
                                size="sm" 
                                className="flex-1 h-7 text-[10px] px-2"
                                disabled={updateWish.isPending}
                                onClick={() => {
                                  if (confirm("Mark this wish as picked?")) {
                                    updateWish.mutate({ wishId: wish.id, status: 'surprise_in_progress' });
                                  }
                                }}
                              >
                                <Gift className="w-2.5 h-2.5 mr-1" /> Pick
                              </Button>
                              <Button 
                                size="sm" 
                                variant="secondary" 
                                className="flex-1 h-7 text-[10px] px-2"
                                disabled={updateWish.isPending}
                                onClick={() => {
                                  if (confirm("Pass on this wish?")) {
                                    updateWish.mutate({ wishId: wish.id, status: 'not_this_time' });
                                  }
                                }}
                              >
                                Pass
                              </Button>
                            </div>
                          ) : (
                            <div className="mt-2 pt-2 border-t border-black/5 space-y-2">
                              <div className="flex items-center justify-between">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wider ${wish.status === 'surprise_in_progress' ? 'bg-[#FF6B6B]/10 text-[#FF6B6B]' : 'bg-black/5 text-muted-foreground'}`}>
                                  {wish.status === 'surprise_in_progress' ? 'Confirmed' : 'Passed'}
                                </span>
                                {wish.status === 'surprise_in_progress' && !wish.revealSender && (
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    className="h-6 text-[9px] px-2"
                                    onClick={() => {
                                      const note = prompt("Write a note for the recipient (optional):");
                                      if (note !== null) {
                                        updateWish.mutate({ 
                                          wishId: wish.id, 
                                          status: wish.status,
                                          revealSender: true,
                                          senderNote: note
                                        });
                                      }
                                    }}
                                  >
                                    Reveal Sender
                                  </Button>
                                )}
                              </div>
                              {wish.revealSender && (
                                <div className="bg-amber-50 p-2 rounded border border-amber-100 text-[10px]">
                                  <p className="font-bold text-amber-700">Identity Revealed ✨</p>
                                  {wish.senderNote && <p className="text-amber-600 italic mt-0.5 line-clamp-2">"{wish.senderNote}"</p>}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-6 bg-black/5 rounded-lg border border-dashed border-black/10">
                      <p className="text-xs text-muted-foreground">No wishes yet...</p>
                    </div>
                  )}
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-20">
          <div className="w-20 h-20 bg-white shadow-xl rounded-full flex items-center justify-center mx-auto mb-6">
            <Gift className="w-10 h-10 text-[#FF6B6B]" />
          </div>
          <h2 className="text-2xl font-bold mb-3">No Secret Wishes Yet</h2>
          <p className="text-muted-foreground mb-8 max-w-md mx-auto">Create your first link to start sending anonymous wish requests to your friends and loved ones.</p>
          <Link href="/create" className="inline-block">
            <Button size="lg">Create Your First Wish</Button>
          </Link>
        </motion.div>
      )}

      {/* Bottom Banner */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-12 flex justify-center"
      >
        <div className="bg-white/90 backdrop-blur-lg border border-[#FF6B6B]/20 shadow-xl rounded-2xl px-6 py-4 flex items-center gap-4 max-w-2xl w-full">
          <div className="bg-gradient-to-br from-amber-200 to-orange-400 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
            <Sparkles className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-foreground text-sm">Anniversary Mode coming soon!</h4>
            <p className="text-xs text-muted-foreground">Just Because Surprises 🎁</p>
          </div>
          <Button variant="secondary" size="sm" disabled className="opacity-50">
            Other Events
          </Button>
        </div>
      </motion.div>
    </div>
  );
}
