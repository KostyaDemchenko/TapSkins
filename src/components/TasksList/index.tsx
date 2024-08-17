import React, { useEffect, useState } from "react";

// Component import
import ProgressBar from "@/src/components/ProgressBar";
import { TaskCard } from "@/src/components/Carts";
import DailyReward from "@/src/components/DailyReward";
import Skeleton from "@mui/material/Skeleton";
import RewardModal from "@/src/components/RevardModal";

// Style import
import "./style.scss";

import { TaskProps, User } from "@/src/utils/types";
import { formatDate } from "@/src/utils/functions";

interface TasksResponse {
  unCompletedTasks: TaskProps[];
  tasks: {
    completed: number;
    total: number;
  };
}

const TasksList: React.FC<{ user: User }> = ({ user }) => {
  const [tasks, setTasks] = useState<TasksResponse>({
    unCompletedTasks: [],
    tasks: {
      completed: 0,
      total: 0,
    },
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedTask, setSelectedTask] = useState<TaskProps | null>(null);
  const [showModal, setShowModal] = useState<boolean>(false);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const data = await user.getTasks();
        setTasks(data);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    };

    fetchTasks();
  }, []);

  const handleTaskClick = (task: TaskProps) => {
    if (task.platform_type === "Telegram") {
      const formattedLink = task.link_to_join.replace("https://t.me/", "@");
      console.log(`Join Telegram channel: ${formattedLink}`);
    } else {
      // Используем window.open с параметром "_blank"
      window.open(task.link_to_join, "_blank");
    }

    setSelectedTask(task);
    setShowModal(true);
  };

  return (
    <>
      <ProgressBar
        titleVisible={true}
        title='Tasks'
        total={tasks.tasks.total}
        completed={tasks.tasks.completed} // Можно заменить на переменную, которая считает завершенные задачи
        isLoading={loading} // Передаем состояние загрузки
      />
      <div className='tasks-list'>
        {loading ? (
          <Skeleton
            variant='rounded'
            height={84}
            animation='wave'
            sx={{
              bgcolor: "var(--color-surface)",
              marginBottom: "5px",
              width: "100%",
            }}
          />
        ) : (
          user && (
            <DailyReward
              lastTimeClicked={formatDate(user.last_daily_bonus_time_clicked)}
              // lastTimeClicked={"05-08-2024 00:00:00"}
              user={user}
            />
          )
        )}
        {loading
          ? Array.from(new Array(5)).map((_, index) => (
              <Skeleton
                key={index}
                variant='rounded'
                height={84}
                animation='wave'
                sx={{
                  bgcolor: "var(--color-surface)",
                  marginBottom: "5px",
                  width: "100%",
                }}
              />
            ))
          : tasks.unCompletedTasks.map((task) => (
              <TaskCard
                key={task.task_id}
                task={task}
                onClick={() => handleTaskClick(task)}
                id={`rewardTrigger-${task.task_id}`}
              />
            ))}
      </div>
      {selectedTask && (
        <RewardModal
          triggerId={`rewardTrigger-${selectedTask.task_id}`}
          isVisible={showModal}
          onClose={() => setShowModal(false)}
          rewardAmount={selectedTask.reward}
          rewardName={selectedTask.task_name}
          rewardType={selectedTask.reward_type}
        />
      )}
    </>
  );
};

export default TasksList;
