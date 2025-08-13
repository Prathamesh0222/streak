import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Plus } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { HabitInput } from "@/lib/validate";
import { Habit, PREDEFINED_CATEGORIES } from "@/types/habit-types";

export const createHabit = ({
  habits,
  isDialogOpen,
  setIsDialogOpen,
  form,
  onSubmit,
  isLoading,
  showCustomCategory,
  setShowCustomCategory,
}: {
  habits: Habit[];
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  form: UseFormReturn<HabitInput>;
  onSubmit: (values: HabitInput) => void;
  isLoading: boolean;
  showCustomCategory: boolean;
  setShowCustomCategory: (show: boolean) => void;
}) => {
  return (
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
        Your Habits ({habits.length})
      </h3>
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="bg-red-600 dark:text-white hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700 font-semibold">
            <Plus className="w-4 h-4 mr-2" />
            Create Habit
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="text-gray-800 dark:text-gray-200">
              Create New Habit
            </DialogTitle>
            <DialogDescription className="text-gray-600 dark:text-gray-400">
              Add a new habit to track your daily progress and build better
              routines.
            </DialogDescription>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Title
                    </FormLabel>
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
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Description
                    </FormLabel>
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
                    <FormLabel className="text-gray-700 dark:text-gray-300">
                      Category
                    </FormLabel>
                    <FormControl>
                      <div className="space-y-2">
                        <Select
                          onValueChange={(value) => {
                            if (value === "__custom__") {
                              setShowCustomCategory(true);
                              field.onChange("");
                            } else {
                              setShowCustomCategory(false);
                              field.onChange(value);
                            }
                          }}
                          value={
                            showCustomCategory
                              ? "__custom__"
                              : field.value || ""
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select category (optional)" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="__no_category__">
                              No Category
                            </SelectItem>
                            {PREDEFINED_CATEGORIES.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                            <SelectItem value="__custom__">
                              + Add Custom Category
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {showCustomCategory && (
                          <Input
                            placeholder="Enter custom category name"
                            value={field.value}
                            onChange={(e) => field.onChange(e.target.value)}
                            onBlur={() => {
                              if (!field.value) {
                                setShowCustomCategory(false);
                              }
                            }}
                          />
                        )}
                      </div>
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
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Priority
                      </FormLabel>
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
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Frequency
                      </FormLabel>
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
                      <FormLabel className="text-gray-700 dark:text-gray-300">
                        Status
                      </FormLabel>
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
                          <SelectItem value="COMPLETED">Completed</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="border-t pt-4 space-y-4">
                <h4 className="text-md font-medium text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  Goal Setting
                </h4>

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="goalType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Goal Type</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            if (value === "STREAK") {
                              form.setValue("isGoalActive", true);
                            } else {
                              form.setValue("isGoalActive", false);
                            }
                          }}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select goal type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="STREAK">Day Streak</SelectItem>
                            <SelectItem value="WEEKLY_TARGET">
                              Weekly Target
                            </SelectItem>
                            <SelectItem value="MONTHLY_TARGET">
                              Monthly Target
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="goalTarget"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Target Number</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            placeholder="e.g., 30"
                            value={field.value || ""}
                            onChange={(e) => {
                              const value = Number(e.target.value);
                              field.onChange(value || undefined);
                              if (value > 0 && form.getValues("goalType")) {
                                form.setValue("isGoalActive", true);
                              } else {
                                form.setValue("isGoalActive", false);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="goalDeadline"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Goal Deadline</FormLabel>
                      <FormControl>
                        <Input
                          type="date"
                          {...field}
                          min={new Date().toLocaleDateString("en-CA")}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDialogOpen(false);
                    setShowCustomCategory(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-red-600 hover:bg-red-700 dark:bg-red-600 dark:hover:bg-red-700"
                >
                  {isLoading ? "Creating..." : "Create Habit"}
                </Button>
              </div>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
