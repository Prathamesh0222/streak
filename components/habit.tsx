"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { habitSchema, HabitInput } from "@/lib/validate";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import axios from "axios";
import { toast } from "sonner";

interface HabitLog {
  id: string;
  date: string;
  isCompleted: boolean;
  habitId: string;
  createdAt: string;
}

interface Habit {
  id: string;
  title: string;
  description?: string;
  category?: string;
  status: "COMPLETED" | "PENDING" | "ONGOING";
  priority: "HIGH" | "MEDIUM" | "LOW";
  frequency: "DAILY" | "WEEKLY" | "MONTHLY";
  createdAt: string;
  HabitLogs: HabitLog[];
}

export const Habit = () => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const form = useForm<HabitInput>({
    resolver: zodResolver(habitSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      status: "PENDING",
      priority: "MEDIUM",
      frequency: "DAILY",
    },
  });

  const fetchHabits = async () => {
    try {
      const response = await axios.get("/api/habits");
      setHabits(response.data);
    } catch (error) {
      console.error("Failed to fetch habits:", error);
      toast.error("Failed to fetch habits");
    }
  };

  useEffect(() => {
    fetchHabits();
  }, []);

  const onSubmit = async (values: HabitInput) => {
    setIsLoading(true);
    try {
      const response = await axios.post("/api/habits", values);
      toast.success("Habit created successfully!");
      setHabits([response.data.habit, ...habits]);
      form.reset();
      setIsDialogOpen(false);
    } catch (error) {
      console.error("Failed to create habit:", error);
      toast.error("Failed to create habit");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Habits</h2>
      <div className="bg-white border border-gray-200 rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-700">
            Your Habits ({habits.length})
          </h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>Create Habit</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Create New Habit</DialogTitle>
                <DialogDescription>
                  Add a new habit to track your daily progress and build better
                  routines.
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-4"
                >
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter habit title" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter habit description (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter category (optional)"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="LOW">Low</SelectItem>
                              <SelectItem value="MEDIUM">Medium</SelectItem>
                              <SelectItem value="HIGH">High</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="frequency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Frequency</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select frequency" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="DAILY">Daily</SelectItem>
                              <SelectItem value="WEEKLY">Weekly</SelectItem>
                              <SelectItem value="MONTHLY">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Status</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="PENDING">Pending</SelectItem>
                              <SelectItem value="ONGOING">Ongoing</SelectItem>
                              <SelectItem value="COMPLETED">
                                Completed
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setIsDialogOpen(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? "Creating..." : "Create Habit"}
                    </Button>
                  </div>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>

        {habits.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">
              No habits created yet. Create your first habit to get started!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {habits.map((habit) => (
              <div
                key={habit.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-800 mb-1">
                      {habit.title}
                    </h4>
                    {habit.description && (
                      <p className="text-gray-600 text-sm mb-2">
                        {habit.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mb-2">
                      {habit.category && (
                        <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                          {habit.category}
                        </span>
                      )}
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          habit.status === "COMPLETED"
                            ? "bg-green-100 text-green-800"
                            : habit.status === "ONGOING"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {habit.status}
                      </span>
                      <span
                        className={`text-xs px-2 py-1 rounded ${
                          habit.priority === "HIGH"
                            ? "bg-red-100 text-red-800"
                            : habit.priority === "MEDIUM"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-green-100 text-green-800"
                        }`}
                      >
                        {habit.priority}
                      </span>
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {habit.frequency}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      Created: {new Date(habit.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
