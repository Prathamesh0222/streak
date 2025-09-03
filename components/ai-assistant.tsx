import { useEffect, useRef, useState } from "react";
import { Input } from "./ui/input";
import { Clock, Lightbulb, Plus, Send, Star, Target } from "lucide-react";
import { Button } from "./ui/button";
import axios from "axios";
import { ChatMessage, Habit, HabitSuggestion } from "@/types/habit-types";
import { Badge } from "./ui/badge";

export const AiAssistant = ({
  habits,
  onCreateHabit,
}: {
  habits: Habit[];
  onCreateHabit: (suggestion: HabitSuggestion) => void;
}) => {
  const [hasStarted, setHasStarted] = useState<boolean>(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "HIGH":
        return "bg-red-100 text-red-700 dark:bg-red-950/30 dark:text-red-500";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-700 dark:bg-yellow-950/30 dark:text-yellow-500";
      case "LOW":
        return "bg-green-100 text-green-700 dark:bg-green-950/30 dark:text-green-500";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getFrequencyIcon = (frequency: string) => {
    switch (frequency) {
      case "DAILY":
        return <Target className="h-3 w-3" />;
      case "WEEKLY":
        return <Clock className="h-3 w-3" />;
      case "MONTHLY":
        return <Star className="h-3 w-3" />;
      default:
        return <Target className="h-3 w-3" />;
    }
  };

  const examplePrompts = [
    "I want to be healthier and more active",
    "Help me become more productive at work",
    "I want to learn new skills and grow",
    "I need better work-life balance",
    "Help me reduce stress and anxiety",
  ];

  const processMessage = async (prompt: string) => {
    if (isLoading) return;

    setIsLoading(true);
    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      type: "user",
      content: prompt,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue("");
    setHasStarted(true);

    try {
      const response = await axios.post("/api/ai-assistant", {
        prompt: prompt,
        existingHabits: habits,
      });

      const suggestions = response.data.suggestions || [];

      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        type: "assistant",
        content:
          suggestions.length > 0
            ? "Here are some habit suggestions based on your request:"
            : "I couldn't generate specific habit suggestions for that request. Try being more specific about your goals, like 'I want to be healthier' or 'Help me be more productive at work'.",
        suggestions: suggestions.length > 0 ? suggestions : undefined,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isLoading) return;

    await processMessage(inputValue.trim());
  };

  const handleExampleClick = async (prompt: string) => {
    await processMessage(prompt);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="max-w-4xl mx-auto">
      {!hasStarted ? (
        <div className="flex flex-col justify-center min-h-[50vh]">
          <div className="text-center mb-4">
            <h1 className="text-3xl font-bold text-red-500">AI Assistant</h1>
            <p>How can I help with your habits?</p>
          </div>

          <div className="mb-4 max-w-xl mx-auto">
            <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1">
              <Lightbulb className="h-3 w-3" />
              Try these examples:
            </div>
            <div className="flex flex-wrap gap-2">
              {examplePrompts.map((example, index) => (
                <button
                  key={index}
                  onClick={() => handleExampleClick(example)}
                  className="text-xs px-3 py-1.5 bg-muted hover:bg-muted/80 rounded-full transition-colors"
                >
                  {example}
                </button>
              ))}
            </div>
          </div>

          <form
            onSubmit={handleSubmit}
            className="relative max-w-xl mx-auto w-full"
          >
            <Input
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder="Describe your goals... (e.g., 'I want to be healthier')"
              className="rounded-xl py-5 pr-12 border-red-500/20 focus:border-red-500"
            />
            <Button
              type="submit"
              disabled={!inputValue.trim() || isLoading}
              variant={"ghost"}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md"
            >
              <Send className="h-4 w-4 text-red-500" />
            </Button>
          </form>
        </div>
      ) : (
        <div className="overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] h-[640px] space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex gap-3 mx-16 mb-4 ${
                message.type === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`max-w-[80%] space-y-3  ${
                  message.type === "user"
                    ? "bg-red-500 text-white rounded-2xl rounded-br-md px-4 py-2"
                    : "bg-card border border-border/50 rounded-2xl rounded-bl-md p-5"
                }`}
              >
                <p className="text-sm">{message.content}</p>
                {message.suggestions && message.suggestions.length > 0 && (
                  <div className="space-y-3 pt-2">
                    {message.suggestions.map((suggestion, index) => (
                      <div
                        key={index}
                        className="bg-background border border-border/50 rounded-lg p-5 space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 space-y-1">
                            <h4 className="font-medium text-sm">
                              {suggestion.title}
                            </h4>
                            <p className="text-xs text-muted-foreground">
                              {suggestion.description}
                            </p>
                            <div className="text-xs text-muted-foreground italic">
                              {suggestion.reasoning}
                            </div>
                          </div>
                          <Button
                            onClick={() => onCreateHabit(suggestion)}
                            size="sm"
                            className="bg-red-500 hover:bg-red-600 text-white shrink-0 h-7 px-2"
                          >
                            <Plus className="w-3 h-3 mr-1" />
                            Add
                          </Button>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <div className="flex items-center gap-1">
                            {getFrequencyIcon(suggestion.frequency)}
                            <Badge className="text-xs">
                              {suggestion.frequency}
                            </Badge>
                          </div>
                          <Badge
                            variant={"outline"}
                            className={`text-xs px-2 py-0.5 rounded border border-border/50 ${getPriorityColor(
                              suggestion.priority
                            )}`}
                          >
                            {suggestion.priority}
                          </Badge>
                          <Badge
                            variant={"outline"}
                            className="text-xs bg-muted px-2 py-0.5 rounded border border-border/50"
                          >
                            {suggestion.category}
                          </Badge>
                          {suggestion.goalTarget && (
                            <Badge variant={"destructive"} className="text-xs">
                              Goal: {suggestion.goalTarget}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex gap-3 justify-start mx-16">
              <div className="bg-muted rounded-2xl rounded-bl-md px-4 py-2">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.1s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
          <div className="fixed bottom-0 mb-24 md:mb-12 w-full flex justify-center items-center max-w-4xl mx-auto">
            <form
              onSubmit={handleSubmit}
              className="relative max-w-3xl mx-auto w-full"
            >
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Describe your goals... (e.g., 'I want to be healthier')"
                className="rounded-xl py-5 pr-12 border-red-500/20 focus:border-red-500"
              />
              <Button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                variant={"ghost"}
                className="absolute right-2 top-1/2 -translate-y-1/2 h-7 w-7 rounded-md"
              >
                <Send className="h-4 w-4 text-red-500" />
              </Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
