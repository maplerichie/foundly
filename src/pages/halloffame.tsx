import { GetServerSideProps } from "next";
import { Layout } from "../components";

export interface User {
  id: string;
  address: string;
  email: string;
  profileImageUrl: string;
  point: number;
}

interface Props {
  users: User[];
}

export default function HallOfFame({ users }: Props) {
  return (
    <Layout>
      <h1 className="text-4xl font-bold mb-4">Look What We Did!</h1>
      <ul className="divide-y divide-gray-200">
        {users.map((user, index) => (
          <li key={user.id} className="py-4 flex">
            <div className="flex-shrink-0">
              <img
                className="h-10 w-10 rounded-full"
                src={user.profileImageUrl}
                alt={user.address}
              />
            </div>
            <div className="ml-3 self-center">
              {index === 0 && (
                <div className="ml-auto flex items-center">
                  <span className="px-2 py-1 text-green-800 text-xs font-medium bg-green-100 rounded-full mr-2">
                    <span role="img" aria-label="First Place">
                      🥇
                    </span>
                    #1
                  </span>
                </div>
              )}
              {index === 1 && (
                <div className="ml-auto flex items-center">
                  <span className="px-2 py-1 text-yellow-800 text-xs font-medium bg-yellow-100 rounded-full mr-2">
                    <span role="img" aria-label="Second Place">
                      🥈
                    </span>
                    #2
                  </span>
                </div>
              )}
              {index === 2 && (
                <div className="ml-auto flex items-center">
                  <span className="px-2 py-1 text-gray-800 text-xs font-medium bg-gray-100 rounded-full mr-2">
                    <span role="img" aria-label="Third Place">
                      🥉
                    </span>
                    #3
                  </span>
                </div>
              )}
              <p className="text-sm text-gray-500">{user.address}</p>
            </div>
            <div className="ml-auto self-center">
              <p className="text-sm text-gray-500">{user.point}</p>
            </div>
          </li>
        ))}
      </ul>
    </Layout>
  );
}

export const getServerSideProps: GetServerSideProps = async () => {
  const users: User[] = [
    {
      id: "1",
      address: "John Doe",
      email: "john@example.com",
      profileImageUrl: "https://via.placeholder.com/150",
      point: 10,
    },
    {
      id: "2",
      address: "Jane Smith",
      email: "jane@example.com",
      profileImageUrl: "https://via.placeholder.com/150",
      point: 8,
    },
    {
      id: "3",
      address: "Bob Johnson",
      email: "bob@example.com",
      profileImageUrl: "https://via.placeholder.com/150",
      point: 6,
    },
    {
      id: "4",
      address: "David Johnson",
      email: "david@example.com",
      profileImageUrl: "https://via.placeholder.com/150",
      point: 4,
    },
  ];

  return {
    props: {
      users,
    },
  };
};
