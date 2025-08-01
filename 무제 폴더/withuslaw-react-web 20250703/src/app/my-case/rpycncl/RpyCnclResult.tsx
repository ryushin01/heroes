import React, { useEffect, useState } from "react";
import { Size } from "@components/Constants";
import { Button } from "@components";
import useGeoLocation from "@hooks/useGeoLocation";
import { getCompareWithToday } from "@utils/dateUtil";
import { toastState } from "@stores";
import { useSetAtom } from "jotai";
import { TailSpin } from "react-loader-spinner";
import PayFail from "@app/my-case/PayFail";
import PayProceeding from "@app/my-case/PayProceeding";
import PaySuccess from "@app/my-case/PaySuccess";

declare global {
  interface Window {
    receiveLocationData?: (locationData: {
      latitude: number;
      longitude: number;
    }) => void;
  }
}

/**
 * statCd
 * 00 : 상환금 요청
 * 01 : 버튼 비활성화(지급 처리중(요청상태))
 * 99 : 지급 실패
 * 02 : 상환영수증 등록
 * 03, 04 : 상환영수증 확인 중
 * 05 : 상환영수증 반려
 * 10 : 완료 (상환영수증 승인 완료)
 */

/**
 * @name statCd
 * @description 지급 처리 상태 코드
 * @summary 00: 지급정보 등록 > 상환금 요청하기 버튼 노출
 *          01: 지급 처리 중(요청 상태) > 상환금 요청하기 버튼 비활성화
 *          02: 지급 완료
 *          03: 상환금 영수증 처리 중(관리자)
 *          04: 상환금 영수증 전송 중
 *          05: 상환금 여수증 반려 (관리자)
 *          10: 상환금 영수증 처리 완료
 *          91: 지급 요청 실패
 *          92: 지급 결과 실패
 *          93: 이미지 전송 실패
 *          94: 이미지 전송 결과 실패
 *          999: 응답 지연
 */

export default function RpyCnclResult({
  statCd,
  handleOpenLocationSheet,
  handlePayRefundRequest,
  handleClickEnrollReceipt,
  loanNo,
  masterStatCd,
  errCd,
  bankCd,
  execDt,
}: {
  statCd: string;
  /** 02:설정 의뢰서 등록 10:대출 실행 14:상환금 처리 20:접수번호 등록 40:설정서류 */
  masterStatCd?: string;
  handleOpenLocationSheet: () => void;
  handlePayRefundRequest: () => void;
  handleClickEnrollReceipt: () => void;
  loanNo: string;
  bankCd: string;
  errCd: string;
  execDt?: string;
}) {
  const callToast = useSetAtom(toastState);
  const location = useGeoLocation();
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 관리
  const [isLocationLoaded, setIsLocationLoaded] = useState(false); // location 로드 상태 관리

  // 대출실행일이 현재보다 과거이면 true, 같거나 미래이면 false
  const isPast = getCompareWithToday(execDt) === "past";

  const handleClick = () => {
    const savedLocationStatus = localStorage.getItem("isLocationLoaded");
    const isLocationLoadedFromStorage = savedLocationStatus === "true";

    if (!isLocationLoadedFromStorage) {
      callToast({
        msg: "위치 정보가 확인되지 않습니다.\n다시 시도해주세요.",
        status: "notice",
      });
    } else {
      handleOpenLocationSheet();
      setIsLoading(false); // 바텀 시트가 열린 후 로딩 상태 해제
    }
  };

  useEffect(() => {
    // 위치가 로드되면 상태 업데이트
    if (location.loaded) {
      const savedLocationStatus = localStorage.getItem("isLocationLoaded");
      setIsLocationLoaded(true);
      setIsLoading(false); // 로딩 종료
    } else {
      setIsLoading(true); // 로딩 애니메이션
      localStorage.setItem("isLocationLoaded", "false");
    }
  }, [location.loaded]);

  const statNum = !!statCd ? parseInt(statCd) : 0;

  // 상관금 요청(= 지급정보 등록)
  // if (statCd === "00") {
  //   return (
  //     <div className="px-5">
  //       {/* 버튼 클릭 후 로딩 상태일 때 로딩 애니메이션 표시 */}
  //       {isLoading ? (
  //         <div className="flex justify-center items-center">
  //           <TailSpin color="#FABE00" width={50} height={50} />
  //         </div>
  //       ) : (
  //         // 로딩 중이 아닐 때 버튼 표시
  //         <Button.CtaButton
  //           size={Size.Medium}
  //           state="Default"
  //           disabled={isPast} // D+1일 이면 비활성화
  //           onClick={handleClick}
  //         >
  //           상환금 요청하기
  //         </Button.CtaButton>
  //       )}
  //     </div>
  //   );
  // }

  if (statNum >= 90) {
    return (
      <div className="flex justify-between">
        <PayFail errCd={errCd} />
        {statNum !== 92 && (
          <Button.CtaButton
            size={Size.Small}
            state={"Default"}
            disabled={isPast} // D+1일 이면 비활성화
            onClick={handlePayRefundRequest}
          >
            다시 요청하기
          </Button.CtaButton>
        )}
      </div>
    );
  }

  if (statCd === "02")
    return (
      <div className="px-5">
        <Button.SecondaryButton
          size={Size.Medium}
          disabled={isPast} // D+1일 이면 비활성화
          style={{ width: "100%", padding: "10px 0" }}
          onClick={handleClickEnrollReceipt}
        >
          상환영수증 등록
        </Button.SecondaryButton>
      </div>
    );

  if (statCd === "" || statCd === "01")
    return <PayProceeding text={"지급 요청 중"} />;

  if (statCd === "03" || statCd === "04")
    return (
      <div className="flex w-full justify-between">
        <PayProceeding text={"상환영수증 확인 중"} />
        {/* <div className="basis-1/3">
          <Button.SecondaryButton
            size={Size.Medium}
            style={{ width: "100%", padding: "10px 0px" }}
            onClick={() => {
              //@ts-ignore
              window.flutter_inappwebview.callHandler("flutterFunc", {
                // @ts-ignore
                mode: "IMAGE_VIEW",
                data: {
                  wkCd: "IMAGE_BIZ",
                  attcFilCd:  bankCd  === "020" ? "2" : "3",
                  loanNo: loanNo,
                },
              });
            }}
          >
            영수증확인
          </Button.SecondaryButton>
        </div> */}
      </div>
    );

  if (statCd === "05")
    return (
      <div className="flex justify-between">
        <PayFail text="반려" />
        <Button.CtaButton
          size={Size.Small}
          disabled={isPast} // D+1일 이면 비활성화
          state="None"
          onClick={() => {
            // @ts-ignore
            window.flutter_inappwebview.callHandler("flutterFunc", {
              mode: "IMAGE_VIEW",
              data: {
                wkCd: "IMAGE_BIZ",
                attcFilCd: bankCd === "020" ? "2" : "3",
                loanNo: loanNo,
                returnYn: "Y",
                bankCd: bankCd, //bankCd 추가
              },
            });
          }}
        >
          상환영수증 재등록
        </Button.CtaButton>
      </div>
    );

  // 상태코드가 "10"이면 완료 페이지 표시
  if (statCd === "10") return <PaySuccess text="완료" />;
}
