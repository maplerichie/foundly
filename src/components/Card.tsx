import Image from "next/image";
// import moment from "moment";
import moment from "moment-timezone";
import { useState } from "react";
import Cookies from "js-cookie";
import { prepareWriteContract, writeContract } from "@wagmi/core";
import {
  publicDb,
  publicFound,
  publicLost,
  publicUser,
} from "../helpers/polybase";
import { FOUNDLY_ABI, FOUNDLY_ADDR } from "../constants";
import * as eth from "@polybase/eth";
import { useRouter } from "next/router";
import { FaCircleNotch } from "react-icons/fa";

interface Props {
  item: any;
  type: string;
}

export const Card = ({ item, type }: Props) => {
  const router = useRouter();
  const [userId, setUserId] = useState(Cookies.get("id") || "");
  const [showItemModal, setShowItemModal] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleShowModal = () => {
    setError("");
    setShowItemModal(true);
  };

  const handleCloseModal = () => {
    if (loading) return;
    setShowItemModal(false);
  };

  const handleCancel = async () => {
    setLoading(true);
    setError("");
    try {
      const prepareTx = await prepareWriteContract({
        address: FOUNDLY_ADDR,
        abi: FOUNDLY_ABI,
        functionName: "cancelItem",
        args: [item.id],
      });
      const tx = await writeContract(prepareTx);
      tx.wait(3).then(async (receipt) => {
        publicDb.signer(async (data: string) => {
          const accounts = await eth.requestAccounts();
          const account = accounts[0];
          const sig = await eth.sign(data, account);
          return { h: "eth-personal-sign", sig };
        });
        await publicLost.record(item.id).call("cancel");
        // setShowItemModal(false);
        router.reload();
      });
    } catch (error: any) {
      setLoading(false);
      setError(error.reason || error.message);
    }
  };

  const handleFound = async () => {
    publicDb.signer(async (data: string) => {
      const accounts = await eth.requestAccounts();
      const account = accounts[0];
      const sig = await eth.sign(data, account);
      return { h: "eth-personal-sign", sig };
    });
    await publicLost.record(item.id).call("cancel");
  };

  return (
    <>
      <div
        className="bg-white rounded-lg shadow-md overflow-hidden"
        onClick={handleShowModal}
      >
        <div className="relative w-full h-0" style={{ paddingBottom: "100%" }}>
          <Image
            src={`/items/${item.id}`}
            alt={item.name}
            width={300}
            height={300}
          />
        </div>
        <div className="p-4">
          <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
          <p className="text-gray-600 text-right">
            {moment(parseInt(item.date) * 1000)
              .tz(moment.tz.guess())
              .format("MMMM Do YYYY")}
          </p>
        </div>
      </div>
      {showItemModal && (
        <>
          <div
            className="fixed inset-0 bg-gray-500 bg-opacity-75"
            onClick={handleCloseModal}
          />
          <div className="absolute flex justify-center items-center z-10">
            <div className="bg-white p-8 rounded-lg z-20">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl">💡</span>
                <div className="flex">
                  <p className="text-gray-500 mr-2">Created by:</p>
                  <p className="mb-2">
                    0x
                    {(type === "lost" ? item.owner.id : item.finder.id).slice(
                      0,
                      4
                    )}
                    ...
                  </p>
                </div>
              </div>
              <div className="flex flex-col items-center mb-6">
                <Image
                  src={`/items/${item.id}`}
                  alt={item.name}
                  width={360}
                  height={360}
                />
                <div>
                  <h2 className="text-2xl font-bold m-4">{item.name}</h2>
                  <hr />
                  <p className="mb-2 mt-2">{item.description}</p>
                  <p className="mb-2">
                    <span className="text-gray-500 mr-4">📍</span>
                    {item.location}
                  </p>
                </div>
              </div>

              {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 my-2 rounded relative mt-4 ">
                  <strong className="font-bold">{error}</strong>
                </div>
              )}
              <div className="flex justify-end">
                {type === "lost" &&
                  (item.owner.id === userId
                    ? item.status === 0 && (
                        <button
                          className="bg-orange-400 hover:bg-orange-500 text-white rounded-lg px-4 py-2"
                          disabled={loading}
                          onClick={handleCancel}
                        >
                          {loading ? (
                            <FaCircleNotch className="animate-spin text-4xl " />
                          ) : (
                            "Cancel"
                          )}
                        </button>
                      )
                    : (item.status === 0 || item.status === 1) && (
                        <button className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg px-4 py-2 mr-4">
                          Found it!
                        </button>
                      ))}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};
