import { AvatarComponent } from "@rainbow-me/rainbowkit";
import Link from "next/link";

export const Avatar: AvatarComponent = ({ address, ensImage, size }) => {
  return (
    <div className="text-center rounded-full overflow-hidden">
      {ensImage ?? <span>😊</span>}
    </div>
  );
};
