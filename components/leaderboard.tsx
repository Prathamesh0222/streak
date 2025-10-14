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
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Medal className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium">Leaderboard</h2>
            <p className="text-sm text-muted-foreground">
              Top performers this month
            </p>
          </div>
        </div>

        <div className="border border-red-500/20 rounded-xl bg-card p-1">
          <div className="p-8 bg-background border border-red-500/20 rounded-lg">
            <div className="flex items-center justify-center gap-3">
              <Clock className="w-5 h-5 animate-spin text-red-500" />
              <span className="text-red-500 dark:text-red-400 font-medium">
                Loading champions...
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center">
            <Medal className="h-4 w-4 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-medium">Leaderboard</h2>
            <p className="text-sm text-muted-foreground">
              Top performers this month
            </p>
          </div>
        </div>

        <div className="border border-red-500/20 rounded-xl bg-card p-1">
          <div className="p-8 bg-background border border-red-500/20 rounded-lg">
            <div className="text-center text-red-500 dark:text-red-400 font-medium">
              Unable to load leaderboard
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 mt-6.5">
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
        <div className="border border-red-500/20 rounded-xl bg-card p-1">
          <div className="p-8 bg-background border border-red-500/20 rounded-lg text-center">
            <div className="w-12 h-12 rounded-xl bg-muted flex items-center justify-center mx-auto mb-3">
              <Target className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-base font-semibold mb-2">No users yet</h3>
            <p className="text-sm text-muted-foreground">
              Be the first to earn XP and appear on the leaderboard!
            </p>
          </div>
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
                      className={`border rounded-xl p-1 transition-all duration-300 ${
                        rank === 1
                          ? "border-yellow-500/30 bg-yellow-50 dark:bg-yellow-950/20 hover:border-yellow-300 dark:hover:border-yellow-700"
                          : rank === 2
                          ? "border-gray-500/30 bg-gray-50 dark:bg-gray-950/20 hover:border-gray-300 dark:hover:border-gray-700"
                          : "border-amber-500/30 bg-amber-50 dark:bg-amber-950/20 hover:border-amber-300 dark:hover:border-amber-700"
                      } ${isCurrentUser ? "ring-2 ring-red-500/50" : ""}`}
                    >
                      <div
                        className={`relative p-6 bg-background border rounded-lg ${
                          rank === 1
                            ? "border-yellow-500/20"
                            : rank === 2
                            ? "border-gray-500/20"
                            : "border-amber-500/20"
                        }`}
                      >
                        <div className="absolute -top-3 left-6">
                          <div
                            className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-md ${
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
                              className={`w-12 h-12 rounded-xl flex items-center justify-center shadow-sm ${
                                rank === 1
                                  ? "bg-yellow-500"
                                  : rank === 2
                                  ? "bg-gray-400"
                                  : "bg-amber-500"
                              }`}
                            >
                              <span className="text-white font-medium text-base">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <h3 className="font-semibold text-base truncate">
                                {user.name}
                              </h3>
                              <p className="text-xs text-muted-foreground font-medium">
                                {rank === 1
                                  ? "🏆 Champion"
                                  : rank === 2
                                  ? "🥈 Runner-up"
                                  : "🥉 Third Place"}
                              </p>
                            </div>
                            {isCurrentUser && (
                              <span className="bg-red-500 text-white px-2.5 py-1 rounded-lg text-xs font-medium shadow-sm">
                                You
                              </span>
                            )}
                          </div>

                          <div className="space-y-3">
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground font-medium">
                                XP Points
                              </span>
                              <span
                                className={`font-bold text-base ${
                                  rank === 1
                                    ? "text-yellow-600 dark:text-yellow-500"
                                    : rank === 2
                                    ? "text-gray-600 dark:text-gray-400"
                                    : "text-amber-600 dark:text-amber-500"
                                }`}
                              >
                                {user.totalXp.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-muted-foreground font-medium">
                                Rank
                              </span>
                              <span className="font-semibold text-sm text-foreground">
                                #{rank}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}

          <div className="border border-red-500/20 rounded-xl bg-card p-1 hover:border-red-200 dark:hover:border-red-800 transition-all duration-300">
            <div className="bg-background border border-red-500/20 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-red-500/20">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-lg flex items-center justify-center shadow-sm">
                    <Award className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-base font-semibold">Full Rankings</h3>
                </div>
              </div>

              <div className="divide-y divide-red-500/10">
                {leaderboard.map((user: LeaderboardUser, index: number) => {
                  const rank = index + 1;
                  const isCurrentUser = session?.user?.id === user.id;

                  return (
                    <div
                      key={user.id}
                      className={`p-4 md:p-6 transition-colors hover:bg-red-50/50 dark:hover:bg-red-950/10 ${
                        isCurrentUser ? "bg-red-50 dark:bg-red-950/20" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3 md:gap-4">
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <div
                            className={`w-7 h-7 md:w-8 md:h-8 rounded-lg flex items-center justify-center text-white font-semibold text-xs md:text-sm shadow-sm ${
                              rank === 1
                                ? "bg-yellow-500"
                                : rank === 2
                                ? "bg-gray-400"
                                : rank === 3
                                ? "bg-amber-500"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {rank}
                          </div>
                          {rank <= 3 && (
                            <div
                              className={`w-5 h-5 md:w-6 md:h-6 rounded-lg flex items-center justify-center ${
                                rank === 1
                                  ? "bg-yellow-100 dark:bg-yellow-900/30"
                                  : rank === 2
                                  ? "bg-gray-100 dark:bg-gray-800"
                                  : "bg-amber-100 dark:bg-amber-900/30"
                              }`}
                            >
                              {rank === 1 ? (
                                <Crown className="w-3 h-3 md:w-4 md:h-4 text-yellow-600 dark:text-yellow-500" />
                              ) : rank === 2 ? (
                                <Trophy className="w-3 h-3 md:w-4 md:h-4 text-gray-600 dark:text-gray-400" />
                              ) : (
                                <Medal className="w-3 h-3 md:w-4 md:h-4 text-amber-600 dark:text-amber-500" />
                              )}
                            </div>
                          )}
                        </div>

                        <div className="w-8 h-8 md:w-10 md:h-10 bg-red-500 rounded-xl flex items-center justify-center shadow-sm flex-shrink-0">
                          <span className="text-white font-medium text-xs md:text-sm">
                            {user.name.charAt(0).toUpperCase()}
                          </span>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-1 md:gap-4">
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1 md:mb-0">
                                <h4 className="font-semibold text-sm truncate">
                                  {user.name}
                                </h4>
                                {isCurrentUser && (
                                  <span className="bg-red-500 text-white px-2.5 py-0.5 rounded-lg text-xs font-medium flex-shrink-0 shadow-sm">
                                    You
                                  </span>
                                )}
                              </div>
                              {rank <= 3 && (
                                <div className="text-xs text-muted-foreground font-medium">
                                  {rank === 1
                                    ? "🏆 Champion"
                                    : rank === 2
                                    ? "🥈 Runner-up"
                                    : "🥉 Third Place"}
                                </div>
                              )}
                            </div>

                            <div className="flex items-center justify-between md:flex-col md:items-end gap-2">
                              <div className="font-bold text-sm md:text-base text-red-500 dark:text-red-400">
                                {user.totalXp.toLocaleString()} XP
                              </div>
                              <div
                                className={`inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-medium ${
                                  rank <= 3
                                    ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                                    : "bg-muted text-muted-foreground"
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
        </div>
      )}
    </div>
  );
};
