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
import { Plus, Target, Tag, Zap, Repeat, Activity } from "lucide-react";
import { UseFormReturn } from "react-hook-form";
import { HabitInput } from "@/lib/validate";
import { PREDEFINED_CATEGORIES } from "@/types/habit-types";

export const createHabit = ({
  isDialogOpen,
  setIsDialogOpen,
  form,
  onSubmit,
  isLoading,
  showCustomCategory,
  setShowCustomCategory,
}: {
  isDialogOpen: boolean;
  setIsDialogOpen: (open: boolean) => void;
  form: UseFormReturn<HabitInput>;
  onSubmit: (values: HabitInput) => void;
  isLoading: boolean;
  showCustomCategory: boolean;
  setShowCustomCategory: (show: boolean) => void;
}) => {
  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogTrigger asChild>
        <div className="flex justify-end">
          <Button className="bg-red-500 hover:bg-red-600 text-white rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Add Habit
          </Button>
        </div>
      </DialogTrigger>
      <DialogContent className="md:max-w-[500px]">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Target className="h-4 w-4 text-white" />
            </div>
            <div>
              <DialogTitle className="text-lg font-medium">
                Create New Habit
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Build better routines and track your daily progress
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Habit Title
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Read for 30 minutes"
                        className="border-red-500/20 focus:border-red-500"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium">
                      Description{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your habit and why it's important to you..."
                        className="border-red-500/20 focus:border-red-500 resize-none"
                        rows={3}
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
                    <FormLabel className="text-sm font-medium flex items-center gap-2">
                      <Tag className="h-3 w-3 text-red-500" />
                      Category{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
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
                              field.onChange(
                                value === "__no_category__" ? "" : value
                              );
                            }
                          }}
                          value={
                            showCustomCategory
                              ? "__custom__"
                              : field.value || "__no_category__"
                          }
                        >
                          <SelectTrigger className="border-red-500/20">
                            <SelectValue placeholder="Choose a category" />
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
                              + Custom Category
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        {showCustomCategory && (
                          <Input
                            placeholder="Enter custom category name"
                            className="border-red-500/20 focus:border-red-500"
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
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-3">
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs font-medium flex items-center gap-1">
                        <Zap className="h-3 w-3 text-red-500" />
                        Priority
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-red-500/20 text-xs">
                            <SelectValue placeholder="Priority" />
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
                      <FormLabel className="text-xs font-medium flex items-center gap-1">
                        <Repeat className="h-3 w-3 text-red-500" />
                        Frequency
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-red-500/20 text-xs">
                            <SelectValue placeholder="How often" />
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
                      <FormLabel className="text-xs font-medium flex items-center gap-1">
                        <Activity className="h-3 w-3 text-red-500" />
                        Status
                      </FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger className="border-red-500/20 text-xs">
                            <SelectValue placeholder="Status" />
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
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="goalTarget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium">
                      Target Number{" "}
                      <span className="text-muted-foreground text-xs">
                        (optional)
                      </span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="e.g., 30 days, 10 books, 5000 steps"
                        className="border-red-500/20 focus:border-red-500"
                        value={field.value || ""}
                        onChange={(e) => {
                          const value = Number(e.target.value);
                          field.onChange(value || undefined);
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsDialogOpen(false);
                  setShowCustomCategory(false);
                  form.reset();
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="bg-red-500 hover:bg-red-600 text-white"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Habit
                  </>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};
