import { GatsbyImage } from "gatsby-plugin-image"
import React, { useEffect, useMemo, useRef, useState } from "react"

import { CharacterInfo, CharacterKey } from "../types/dormitoryCharacter"

import PlayButton from "../components/playButton"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faHome } from "@fortawesome/free-solid-svg-icons"

type DescriptionType = "プロフィール" | "呼び方"

export default ({
  isActive,
  hide,
  characterKey,
  characterKeys,
  characterInfos,
}: {
  isActive: boolean
  hide: () => void
  characterKey: CharacterKey
  characterKeys: CharacterKey[]
  characterInfos: {
    [key in CharacterKey]: CharacterInfo
  }
}) => {
  const [descriptionType, setDescriptionType] =
    useState<DescriptionType>("プロフィール")

  const characterInfo = useMemo(
    () => characterInfos[characterKey],
    [characterKey]
  )

  // リセット
  const scrollRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (isActive) {
      setDescriptionType("プロフィール")
      if (scrollRef.current) {
        scrollRef.current.scroll(0, 0)
      }
    }
  }, [isActive])

  const TypeButton = ({ targetType }: { targetType: DescriptionType }) => {
    const selected = descriptionType === targetType
    return (
      <button
        className={`button is-rounded description-type-button ${
          selected && "description-type-button-selected"
        }`}
        style={{
          color: characterInfo.color,
          borderColor: characterInfo.color,
          backgroundColor: selected ? characterInfo.lightColor : undefined,
        }}
        onClick={() => setDescriptionType(targetType)}
        type="button"
      >
        <span>{targetType}</span>
      </button>
    )
  }

  const CallBox = ({
    targetCharaterKey,
  }: {
    targetCharaterKey: CharacterKey
  }) => {
    const Arrow = ({ leftOrRight }: { leftOrRight: "left" | "right" }) => (
      <span
        className="description-call-arrow"
        style={{
          color:
            leftOrRight === "right"
              ? characterInfo.color
              : characterInfos[targetCharaterKey].color,
        }}
      >
        {leftOrRight === "left" ? "←" : "→"}
      </span>
    )
    return (
      <div className="columns is-mobile is-vcentered description-call-box">
        <div className="column is-8">
          <div className="description-call-line">
            <Arrow leftOrRight="right" />
            <span
              className="description-call-text"
              style={{ borderColor: characterInfo.color }}
            >
              {characterInfo.callNames[targetCharaterKey]}
            </span>
            <Arrow leftOrRight="right" />
          </div>
          <div className="description-call-line">
            <Arrow leftOrRight="left" />
            <span
              className="description-call-text"
              style={{ borderColor: characterInfos[targetCharaterKey].color }}
            >
              {characterInfos[targetCharaterKey].callNames[characterKey]}
            </span>
            <Arrow leftOrRight="left" />
          </div>
        </div>
        <div className="column is-4 py-1" style={{ height: "100%" }}>
          <GatsbyImage
            className="border-icon"
            image={characterInfos[targetCharaterKey].bustupImage}
            alt={characterInfos[targetCharaterKey].name}
            style={{
              borderColor: characterInfos[targetCharaterKey].color,
              height: "100%",
              aspectRatio: "1/1",
            }}
            imgStyle={{ height: "100%", aspectRatio: "1/1" }}
            objectFit="contain"
          />
        </div>
      </div>
    )
  }

  return (
    <div className={`modal-character modal` + (isActive ? " is-active" : "")}>
      <div className="modal-background" onClick={hide} />
      <div ref={scrollRef} className="modal-content">
        <div className="box" style={{ borderColor: characterInfo.color }}>
          <div className="columns m-0" style={{ height: "100%" }}>
            <div
              className="column is-4 portrait-column"
              style={{ borderColor: characterInfo.color }}
            >
              <GatsbyImage
                image={characterInfo.portraitImage}
                alt={characterInfo.name}
                imgStyle={{ height: "100%", width: "100%" }}
                style={{ height: "100%", width: "100%" }}
              />
            </div>
            <div className="column description-column">
              <div className="section">
                <div className="description-top">
                  <h1
                    className="title"
                    dangerouslySetInnerHTML={{
                      __html: `<ruby>${characterInfo.rubyName}</ruby>`,
                    }}
                  />
                  <a
                    className="button description-top-button"
                    style={{
                      color: characterInfo.color,
                      borderColor: characterInfo.color,
                    }}
                    href={characterInfo.detailUrl}
                    target="_blank"
                    rel="noreferrer"
                  >
                    <FontAwesomeIcon icon={faHome} />
                  </a>
                </div>
                <div className="buttons has-addons">
                  <TypeButton targetType="プロフィール" />
                  <TypeButton targetType="呼び方" />
                </div>
                {descriptionType === "プロフィール" && (
                  <>
                    <div
                      className="description-profile"
                      dangerouslySetInnerHTML={{
                        __html: characterInfo.description,
                      }}
                    />
                    <div className="columns is-multiline">
                      {characterInfo.labelInfos.map((labelInfo, index) => (
                        <div
                          key={index}
                          className={`column ${
                            labelInfo.size == 1 ? "is-6" : "is-12"
                          } description-box`}
                        >
                          <span
                            className="description-label"
                            style={{ backgroundColor: characterInfo.color }}
                          >
                            {labelInfo.label}
                          </span>
                          <span
                            className="description-text"
                            dangerouslySetInnerHTML={{
                              __html: labelInfo.value,
                            }}
                          />
                        </div>
                      ))}
                      <div className="column is-12 description-box">
                        <span
                          className="description-label"
                          style={{ backgroundColor: characterInfo.color }}
                        >
                          音声サンプル
                        </span>
                        {characterInfo.voiceUrls ? (
                          <div className="description-samples">
                            {characterInfo.voiceUrls.map((url, index) => (
                              <PlayButton
                                key={index}
                                url={url}
                                color={characterInfo.color}
                                className="ml-1 mr-1"
                              />
                            ))}
                          </div>
                        ) : (
                          <span className="description-text">準備中</span>
                        )}
                      </div>
                    </div>
                    {characterInfo.infoImages && (
                      <div className="description-info-images">
                        {characterInfo.infoImages.map((image, index) => (
                          <GatsbyImage
                            key={index}
                            image={image}
                            alt={characterInfo.name}
                            style={{
                              maxHeight: "8rem",
                            }}
                          />
                        ))}
                      </div>
                    )}
                  </>
                )}
                {descriptionType === "呼び方" && (
                  <>
                    <div className="columns description-pane">
                      <div className="column is-9">
                        {characterKeys
                          .filter(
                            targetCharaterKey =>
                              targetCharaterKey !== characterKey
                          )
                          .map((targetCharaterKey, index) => (
                            <CallBox
                              key={index}
                              targetCharaterKey={targetCharaterKey}
                            />
                          ))}
                      </div>
                      <div className="column is-3 description-call-other-column">
                        <div className="description-call-other-cell">
                          <div><span>一人称</span></div>
                          <div>
                            {characterInfo.callNames.me.map(callName => <p>{callName}</p>)}
                          </div>
                        </div>
                        <div className="description-call-other-cell">
                          <div><span>二人称</span></div>
                          <div>
                            {characterInfo.callNames.you.map(callName => <p>{callName}</p>)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        <button
          className="modal-close is-large"
          aria-label="close"
          onClick={hide}
          type="button"
        />
      </div>
    </div>
  )
}
