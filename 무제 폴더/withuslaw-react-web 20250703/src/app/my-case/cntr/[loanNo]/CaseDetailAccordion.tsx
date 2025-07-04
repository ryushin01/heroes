"use client";

import React, { useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Arrow, Telephone } from "@icons";
import { TStringKeyObj } from "@app/global";
import { RGSTR_GB_CD } from "@constants";
import { Typography } from "@components";
import { TypographyType } from "@components/typography/Constant";
import { hypenNumber } from "@utils/hypenNumber";
import CurrencyFormat from "react-currency-format";

type TProps = {
  isOpenAccordion: boolean;
  detailInfo?: TDetailInfo;
  toggleAccordion: () => void;
};

const keyKorean: TStringKeyObj = {
  dbtrNm: "차주",
  loanNo: "여신번호",
  lndThngAddr: "주소",
};

/**
 * @name lndHndgSlfDsc
 * @description 대출 취급 주체 구분 코드
 * @summary 1 은행지점
 *          2 모집인(SR)
 */

/**
 * SR건 아래 디테일 추가
 * slmnLndProc     SR 대출프로세스(조건부 취급)
 * slmnLndProcNm   SR 대출프로세스 명(조건부 취급 명)
 * slmnCmpyNm      모집인 회사명
 * slmnNm          모집인 명
 * slmnPhno        모집인 연락처
 **/

export default function CaseDetailAccordion({
  detailInfo,
  toggleAccordion,
  isOpenAccordion,
}: TProps) {
  const targetRef = useRef<HTMLDivElement>(null);

  // 차주 전화연결
  const phoneClick = () => {
    //@ts-ignore
    window.flutter_inappwebview.callHandler("flutterFunc", {
      // @ts-ignore
      mode: "PHONE_CALL",
      data: {
        phoneNo: detailInfo?.dbtrHpno,
      },
    });
  };

  // 대출기관 전화연결
  const phoneClick2 = () => {
    //@ts-ignore
    window.flutter_inappwebview.callHandler("flutterFunc", {
      // @ts-ignore
      mode: "PHONE_CALL",
      data: {
        phoneNo: detailInfo?.bnkBrnchPhno,
      },
    });
  };

  // 전자등기사무소 전화연결
  const phoneClick3 = () => {
    //@ts-ignore
    window.flutter_inappwebview.callHandler("flutterFunc", {
      // @ts-ignore
      mode: "PHONE_CALL",
      data: {
        phoneNo: detailInfo?.elregOfficeTelNo,
      },
    });
  };

  // 대출모집인 연락처 전화연결
  const phoneClick4 = () => {
    //@ts-ignore
    window.flutter_inappwebview.callHandler("flutterFunc", {
      // @ts-ignore
      mode: "PHONE_CALL",
      data: {
        phoneNo: detailInfo?.slmnPhno,
      },
    });
  };

  return (
    <div
      ref={targetRef}
      className={`${isOpenAccordion ? "_scroll-area" : ""} w-full`}
    >
      <div className={`bg-kos-white relative h-fit content-box`}>
        <ul className="pt-4 h-fit">
          {detailInfo &&
            Object.entries(detailInfo).map(
              ([key, value]) =>
                keyKorean[key] && (
                  <li
                    key={`${key}`}
                    className={`flex justify-between items-start transition-all ease-in-out py-1 px-4 `}
                  >
                    <Typography
                      color={"text-kos-gray-600"}
                      type={TypographyType.B2}
                    >
                      {keyKorean[key]}
                    </Typography>
                    <div className="basis-2/3 flex justify-end text-end items-center gap-2">
                      <Typography
                        color={"text-kos-gray-800"}
                        type={TypographyType.B1}
                        className="break-keep"
                      >
                        {(typeof value === "string" ||
                          typeof value === "number") &&
                          value}
                      </Typography>
                      {key === "dbtrNm" && (
                        <button type="button" onClick={phoneClick}>
                          <Image src={Telephone} alt="전화 아이콘" />
                        </button>
                      )}
                    </div>
                  </li>
                )
            )}
        </ul>

        <div className="w-full">
          {!!detailInfo && isOpenAccordion && (
            <>
              <ul className="bg-kos-white w-full pt-px pb-5">
                {/* 공통: 실행일 */}
                <li
                  className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                >
                  <Typography
                    color={"text-kos-gray-600"}
                    type={TypographyType.B2}
                  >
                    실행일
                  </Typography>
                  <div className="basis-2/3 flex justify-end items-center gap-2">
                    <Typography
                      color={"text-kos-gray-800"}
                      type={TypographyType.B1}
                    >
                      {`${detailInfo["execDt"].slice(0, 4)}. ${detailInfo[
                        "execDt"
                      ].slice(4, 6)}. ${detailInfo["execDt"].slice(6, 8)}`}
                    </Typography>
                  </div>
                </li>

                {/* 공통: 실행금액 */}
                <li
                  className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                >
                  <Typography
                    color={"text-kos-gray-600"}
                    type={TypographyType.B2}
                  >
                    실행금액
                  </Typography>
                  <div className="basis-2/3 flex justify-end items-center gap-2">
                    <Typography
                      color={"text-kos-gray-800"}
                      type={TypographyType.B1}
                    >
                      <CurrencyFormat
                        decimalSeparator={"false"}
                        value={detailInfo.execAmt}
                        displayType={"text"}
                        thousandSeparator={true}
                      />
                    </Typography>
                  </div>
                </li>

                {/* 공통: 대출기관 */}
                <li
                  className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                >
                  <Typography
                    color={"text-kos-gray-600"}
                    type={TypographyType.B2}
                  >
                    대출기관
                  </Typography>
                  <div className="basis-2/3 flex justify-end items-center gap-2">
                    <Typography
                      color={"text-kos-gray-800"}
                      type={TypographyType.B1}
                    >
                      {detailInfo.bnkBranchNm}
                    </Typography>
                    {detailInfo?.lndHndgSlfDsc === "1" &&
                      !!detailInfo.bnkBrnchPhno && (
                        <button onClick={phoneClick2}>
                          <Image src={Telephone} alt="전화 아이콘" />
                        </button>
                      )}
                  </div>
                </li>

                {/* 대출 취급 주체가 SR이면서 동시에 대출관리점 데이터 존재하는 경우: 대출관리점 */}
                {detailInfo?.lndHndgSlfDsc === "2" && detailInfo.orgBrnchNm && (
                  <li
                    className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                  >
                    <Typography
                      color={"text-kos-gray-600"}
                      type={TypographyType.B2}
                    >
                      대출관리점
                    </Typography>
                    <div className="basis-2/3 flex justify-end items-center gap-2 text-right">
                      <Typography
                        color={"text-kos-gray-800"}
                        type={TypographyType.B1}
                      >
                        {detailInfo.orgBrnchNm}
                      </Typography>
                    </div>
                  </li>
                )}

                {/* 공통: 대출상품 */}
                <li
                  className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                >
                  <Typography
                    color={"text-kos-gray-600"}
                    type={TypographyType.B2}
                  >
                    대출상품
                  </Typography>
                  <div className="basis-2/3 flex justify-end items-center gap-2 text-right">
                    <Typography
                      color={"text-kos-gray-800"}
                      type={TypographyType.B1}
                      className="ios-break-word"
                    >
                      {detailInfo.lndPrdtNm}
                    </Typography>
                  </div>
                </li>

                {/* 대출 취급 주체가 은행 지점인 경우: 매매금액, 전자등기사무소, 수임철회 */}
                {detailInfo?.lndHndgSlfDsc === "1" && (
                  <>
                    {/* 이전 등기인 경우: 매매금액, 전자등기사무소 */}
                    {detailInfo?.rgstrGbCd === RGSTR_GB_CD["01"] && (
                      <>
                        {/* 매매금액 */}
                        <li
                          className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                        >
                          <Typography
                            color={"text-kos-gray-600"}
                            type={TypographyType.B2}
                          >
                            매매금액
                          </Typography>
                          <div className="basis-2/3 flex justify-end items-center gap-2">
                            <Typography
                              color={"text-kos-gray-800"}
                              type={TypographyType.B1}
                            >
                              <CurrencyFormat
                                decimalSeparator={"false"}
                                value={detailInfo.slPrc}
                                displayType={"text"}
                                thousandSeparator={true}
                              />
                            </Typography>
                          </div>
                        </li>

                        {/* 전자등기사무소 */}
                        <li
                          className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                        >
                          <Typography
                            color={"text-kos-gray-600"}
                            type={TypographyType.B2}
                          >
                            전자등기사무소
                          </Typography>
                          <div className="basis-2/3 flex justify-end items-center gap-2">
                            <Typography
                              color={"text-kos-gray-800"}
                              type={TypographyType.B1}
                            >
                              {detailInfo.elregReptOfficeNm}
                            </Typography>
                            {!!detailInfo.elregOfficeTelNo && (
                              <button onClick={phoneClick3}>
                                <Image src={Telephone} alt="전화 아이콘" />
                              </button>
                            )}
                          </div>
                        </li>

                        {/* 수임철회 버튼 노출 조건인 경우: 수임철회 */}
                        {detailInfo?.clsBtnYn === "Y" && (
                          // 수임철회
                          <li>
                            <Link
                              href={{
                                pathname: "/acceptance/match/accept-fail",
                                query: { loanNo: detailInfo?.loanNo },
                              }}
                              className="flex align-center justify-center ml-auto mr-4 border border-kos-gray-400 py-1 w-[61px] rounded-lg"
                            >
                              <Typography
                                color={"text-kos-gray-700"}
                                type={TypographyType.B5}
                              >
                                수임철회
                              </Typography>
                            </Link>
                          </li>
                        )}
                      </>
                    )}
                  </>
                )}

                {/* 대출 취급 주체가 SR인 경우: 조건부 취급, 대출모집법인, 대출모집인명, 대출모집인 연락처 */}
                {detailInfo?.lndHndgSlfDsc === "2" && (
                  <>
                    {/* 조건부 취급 */}
                    <li
                      className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                    >
                      <Typography
                        color={"text-kos-gray-600"}
                        type={TypographyType.B2}
                      >
                        조건부 취급
                      </Typography>
                      <div className="basis-2/3 flex justify-end items-center gap-2">
                        <Typography
                          color={"text-kos-gray-800"}
                          type={TypographyType.B1}
                        >
                          {detailInfo.slmnLndProcNm}
                        </Typography>
                      </div>
                    </li>

                    {/* 대출모집법인 */}
                    <li
                      className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                    >
                      <Typography
                        color={"text-kos-gray-600"}
                        type={TypographyType.B2}
                      >
                        대출모집법인
                      </Typography>
                      <div className="basis-2/3 flex justify-end items-center gap-2">
                        <Typography
                          color={"text-kos-gray-800"}
                          type={TypographyType.B1}
                        >
                          {detailInfo.slmnCmpyNm}
                        </Typography>
                      </div>
                    </li>

                    {/* 대출모집인명 */}
                    <li
                      className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                    >
                      <Typography
                        color={"text-kos-gray-600"}
                        type={TypographyType.B2}
                      >
                        대출모집인명
                      </Typography>
                      <div className="basis-2/3 flex justify-end items-center gap-2">
                        <Typography
                          color={"text-kos-gray-800"}
                          type={TypographyType.B1}
                        >
                          {detailInfo.slmnNm}
                        </Typography>
                      </div>
                    </li>

                    {/* 대출모집인 연락처 */}
                    <li
                      className={`flex justify-between items-start transition-all ease-in-out py-1 px-4`}
                    >
                      <Typography
                        color={"text-kos-gray-600"}
                        type={TypographyType.B2}
                      >
                        대출모집인 연락처
                      </Typography>
                      <div className="basis-2/3 flex justify-end items-center gap-2">
                        <Typography
                          color={"text-kos-gray-800"}
                          type={TypographyType.B1}
                        >
                          {hypenNumber(detailInfo.slmnPhno)}
                        </Typography>
                        {!!detailInfo.slmnPhno && (
                          <button onClick={phoneClick4}>
                            <Image src={Telephone} alt="전화 아이콘" />
                          </button>
                        )}
                      </div>
                    </li>
                  </>
                )}
              </ul>
            </>
          )}

          <div
            className={`w-full bg-kos-white box-border ${
              isOpenAccordion && "sticky bottom-0 px-4 -mt-px rounded-b-2xl"
            }`}
          >
            <button
              type="button"
              onClick={() => {
                toggleAccordion();
                targetRef.current!.scrollTop = 0;
              }}
              className={`_flex-center relative border-t border-t-1 border-kos-gray-200 gap-1 w-full py-4`}
            >
              <Typography color={"text-kos-gray-700"} type={TypographyType.B4}>
                상세정보 {isOpenAccordion && "접기"}
              </Typography>
              <Image
                src={Arrow}
                alt="상세정보 토글 아이콘"
                className={`transition-all ${
                  isOpenAccordion ? "-rotate-180" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
