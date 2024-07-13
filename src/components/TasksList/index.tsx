import React, { useEffect, useState } from "react";
import Image from "next/image";

import iconObj from "@/public/icons/utils";

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

  useEffect(() => {
    fetch("/api/task_store")
      .then((response) => response.json())
      .then((data) => setTasks(data.taskStoreDataStructured))
      .catch((error) => console.error("Error fetching tasks:", error));
  }, []);

  return (
    <div className='tasks-list'>
      {tasks.map((task) => (
        <div key={task.task_id} className='task-card'>
          <div className='task-icon'>
            <img src={task.social_icon} alt={task.platform_type} />
          </div>
          <div className='task-details'>
            <h3 className='task-name'>{task.task_name}</h3>
            <div className='reward-count-box'>
              <p className='reward-count'>+ {task.reward}</p>
              <div className='reward-type'>
                {task.reward_type === "yellow_coin" ? (
                  <Image
                    src={iconObj.yellowCoin}
                    width={12}
                    height={12}
                    alt='Yellow coin'
                  />
                ) : (
                  <Image
                    src={iconObj.purpleCoin}
                    width={12}
                    height={12}
                    alt='Purple coin'
                  />
                )}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TasksList;
