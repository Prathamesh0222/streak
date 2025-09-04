import { useLeaderboard } from "@/hooks/useLeaderboard";
import { useSession } from "next-auth/react";
import {
  Trophy,
  Medal,
  Award,
  Crown,
  Target,
  Clock,
  TrendingUp,
} from "lucide-react";

interface LeaderboardUser {
  id: string;
  name: string;
  xp: number;
  totalXp: number;
}

export const Leaderboard = () => {
  const { leaderboard, isLoading, error } = useLeaderboard();
  const { data: session } = useSession();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Medal className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Leaderboard</h2>
              <p className="text-xs text-muted-foreground">
                Top performers this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-red-500/20 rounded-xl p-8">
          <div className="flex items-center justify-center gap-3">
            <Clock className="w-5 h-5 animate-spin text-red-500" />
            <span className="text-red-600 dark:text-red-400 font-medium">
              Loading champions...
            </span>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
              <Medal className="h-4 w-4 text-white" />
            </div>
            <div>
              <h2 className="text-lg font-medium">Leaderboard</h2>
              <p className="text-xs text-muted-foreground">
                Top performers this month
              </p>
            </div>
          </div>
        </div>

        <div className="bg-card border border-red-500/20 rounded-xl p-8">
          <div className="text-center text-red-600 dark:text-red-400 font-medium">
            Unable to load leaderboard
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Medal className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="font-medium text-xl">Leaderboard</h2>
            <p className="text-sm text-muted-foreground">
              Top performers this month
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <TrendingUp className="w-4 h-4" />
          <span>{leaderboard.length} competitors</span>
        </div>
      </div>

      {leaderboard.length === 0 ? (
        <div className="bg-card border border-red-500/20 rounded-xl p-8 text-center">
          <Target className="h-8 w-8 text-muted-foreground mx-auto mb-3" />
          <h3 className="text-base font-medium mb-2">No users yet</h3>
          <p className="text-sm text-muted-foreground">
            Be the first to earn XP and appear on the leaderboard!
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          {leaderboard.length >= 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {leaderboard
                .slice(0, 3)
                .map((user: LeaderboardUser, index: number) => {
                  const rank = index + 1;
                  const isCurrentUser = session?.user?.id === user.id;
                  return (
                    <div
                      key={user.id}
                      className={`relative p-6 rounded-2xl border transition-all duration-300 hover:shadow-lg ${
                        rank === 1
                          ? "bg-gradient-to-br from-yellow-50 to-amber-50 dark:from-yellow-950/20 dark:to-amber-950/20 border-yellow-200 dark:border-yellow-800"
                          : rank === 2
                          ? "bg-gradient-to-br from-gray-50 to-slate-50 dark:from-gray-950/20 dark:to-slate-950/20 border-gray-200 dark:border-gray-800"
                          : "bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border-amber-200 dark:border-amber-800"
                      } ${isCurrentUser ? "ring-2 ring-red-400/50" : ""}`}
                    >
                      <div className="absolute -top-3 left-6">
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm shadow-lg ${
                            rank === 1
                              ? "bg-yellow-500"
                              : rank === 2
                              ? "bg-gray-400"
                              : "bg-amber-500"
                          }`}
                        >
                          {rank}
                        </div>
                      </div>

                      <div className="pt-4">
                        <div className="flex items-center gap-3 mb-4">
                          <div
                            className={`w-12 h-12 rounded-full flex items-center justify-center shadow-md ${
                              rank === 1
                                ? "bg-gradient-to-br from-yellow-400 to-yellow-600"
                                : rank === 2
                                ? "bg-gradient-to-br from-gray-400 to-gray-600"
                                : "bg-gradient-to-br from-amber-400 to-amber-600"
                            }`}
                          >
                            <span className="text-white font-medium text-base">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-base truncate">
                              {user.name}
                            </h3>
                            <p className="text-xs text-muted-foreground">
                              {rank === 1
                                ? "🏆 Champion"
                                : rank === 2
                                ? "🥈 Runner-up"
                                : "🥉 Third Place"}
                            </p>
                          </div>
                          {isCurrentUser && (
                            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                              You
                            </span>
                          )}
                        </div>

                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              XP Points
                            </span>
                            <span className="font-bold text-base">
                              {user.totalXp.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-xs text-muted-foreground">
                              Rank
                            </span>
                            <span className="font-medium text-sm">#{rank}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <div className="bg-card border border-red-500/20 rounded-xl overflow-hidden">
            <div className="p-4 md:p-6 border-b border-border">
              <div className="flex items-center gap-3">
                <div className="w-6 h-6 bg-red-500 rounded flex items-center justify-center">
                  <Award className="h-3 w-3 text-white" />
                </div>
                <h3 className="text-base font-medium">Full Rankings</h3>
              </div>
            </div>

            <div className="divide-y divide-border">
              {leaderboard.map((user: LeaderboardUser, index: number) => {
                const rank = index + 1;
                const isCurrentUser = session?.user?.id === user.id;

                return (
                  <div
                    key={user.id}
                    className={`p-4 md:p-6 transition-colors hover:bg-muted/50 ${
                      isCurrentUser ? "bg-red-50 dark:bg-red-950/20" : ""
                    }`}
                  >
                    <div className="flex items-center gap-3 md:gap-4">
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <div
                          className={`w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-white font-medium text-xs md:text-sm ${
                            rank === 1
                              ? "bg-yellow-500"
                              : rank === 2
                              ? "bg-gray-400"
                              : rank === 3
                              ? "bg-amber-500"
                              : "bg-gray-500"
                          }`}
                        >
                          {rank}
                        </div>
                        {rank <= 3 && (
                          <div
                            className={`w-5 h-5 md:w-6 md:h-6 rounded-full flex items-center justify-center ${
                              rank === 1
                                ? "bg-yellow-100 dark:bg-yellow-900/30"
                                : rank === 2
                                ? "bg-gray-100 dark:bg-gray-800"
                                : "bg-amber-100 dark:bg-amber-900/30"
                            }`}
                          >
                            {rank === 1 ? (
                              <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-600" />
                            ) : rank === 2 ? (
                              <Trophy className="w-3 h-3 md:w-4 md:h-4 text-gray-600" />
                            ) : (
                              <Medal className="w-3 h-3 md:w-4 md:h-4 text-amber-600" />
                            )}
                          </div>
                        )}
                      </div>

                      <div className="w-8 h-8 md:w-10 md:h-10 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center shadow-sm flex-shrink-0">
                        <span className="text-white font-medium text-xs md:text-sm">
                          {user.name.charAt(0).toUpperCase()}
                        </span>
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
                          <div className="min-w-0">
                            <div className="flex items-center gap-2 mb-1 md:mb-0">
                              <h4 className="font-medium text-sm truncate">
                                {user.name}
                              </h4>
                              {isCurrentUser && (
                                <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-medium flex-shrink-0">
                                  You
                                </span>
                              )}
                            </div>
                            {rank <= 3 && (
                              <div className="text-xs text-muted-foreground">
                                {rank === 1
                                  ? "🏆 Champion"
                                  : rank === 2
                                  ? "🥈 Runner-up"
                                  : "🥉 Third Place"}
                              </div>
                            )}
                          </div>

                          <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                            <div className="font-bold text-sm md:text-base text-red-600">
                              {user.totalXp.toLocaleString()} XP
                            </div>
                            <div
                              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                                rank <= 3
                                  ? "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400"
                                  : "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
                              }`}
                            >
                              {rank <= 3 ? "Top Performer" : "Active"}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
