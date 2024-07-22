// Default import
import React, { useEffect, useState } from "react";

// Component import
import ProgressBar from "@/src/components/ProgressBar";
import { TaskCard } from "@/src/components/Carts";
import Skeleton from "@mui/material/Skeleton";

// Style import
import "./style.scss";

interface Task {
  task_id: number;
  task_name: string;
  platform_type: string;
  reward_type: string;
  reward: number;
  link_to_join: string;
  social_icon: string;
}

const TasksList: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const completedTasks = 1; // Фиксированное значение для выполненных задач

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await fetch("/api/task_store");
        const data = await response.json();
        setTasks(data.taskStoreDataStructured);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      } finally {
        // Задержка перед отключением загрузки
        setTimeout(() => {
          setLoading(false);
        }, 2000);
      }
    };

    fetchTasks();
  }, []);

  return (
    <>
      <ProgressBar
        titleVisible={true}
        title='Tasks'
        total={tasks.length}
        completed={completedTasks}
      />
      <div className='tasks-list'>
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
          : tasks.map((task) => <TaskCard key={task.task_id} task={task} />)}
      </div>
    </>
  );
};

export default TasksList;
