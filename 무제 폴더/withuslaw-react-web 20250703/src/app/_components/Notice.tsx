import React, { useEffect, useState } from "react";
import { Typography } from "@components";
import { TypographyType } from "@components/typography/Constant";
import { useFetchApi } from "@hooks";
import { useMutation } from "@tanstack/react-query";
import { getCompareWithToday } from "@/utils/dateUtil";

type TNotice = {
  ptupTtl: string;
  ptupSeq: string;
};

export default function Notice() {
  const { fetchApi } = useFetchApi();

  const { data, mutate } = useMutation({
    mutationKey: ["board-list"],
    mutationFn: () =>
      fetchApi({
        url: `${process.env.NEXT_PUBLIC_AUTH_API_URL}/api/board/searchapphomenoti`,
        method: "post",
      })
        .then((res) => res.json())
        .then((res) => res.data),
    onSuccess: (res) => {
      console.log("공지사항 리스트", res);
    },
  });

  useEffect(() => {
    mutate();
  }, [mutate]);

  /* 시퀀스번호의 존재여부 체크, ptupSeq 가 null 또는 undefined 이면 false */
  const isSeqExist = data?.ptupSeq != null;

  return (
    <>
      {!!data && isSeqExist && (
        <div className="relative max-w-md h-[48px] px-4 text-sm rounded-xl">
          <div className="flex items-center left-4">
            <div
              className={`flex items-center transition-all duration-1000 ease-out absolute w-full h-full -top-0 opacity-100`}
              onClick={() => {
                //@ts-ignore
                window.flutter_inappwebview.callHandler("flutterFunc", {
                  // @ts-ignore
                  mode: "NOTI_VIEW",
                  data: {
                    ptupSeq: data.ptupSeq,
                  },
                });
              }}
            >
              <Typography
                color={"text-kos-orange-500"}
                type={TypographyType.H6}
                className="mr-2"
              >
                알림
              </Typography>
              <Typography color={"text-kos-gray-600"} type={TypographyType.B2}>
                {data.ptupTtl}
              </Typography>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
