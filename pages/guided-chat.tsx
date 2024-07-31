import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import socket from "../lib/socket";
import { generateRandomId, getSearchParam } from "../lib/helper";
import "../app/globals.css";
import "../app/chatboat.css";
import "../app/style.css";
import "../app/responsive.css";
import Head from "next/head";

export default function Home() {
  const [username, setUsername] = useState(generateRandomId(12));
  const [msg, setMsg]: any = useState(null);
  const [messages, setMessages]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption]: any = useState([]);
  const [error, setError] = useState("");
  const scrollTop: any = useRef();
  const input: any = useRef();

  const setMessage = (m: any) => {
    setError("");
    m.sender = "user";
    if (!m?.refFrom) {
      m.refFrom = messages?.[messages?.length - 2]?.refFrom || null
    }
    setMsg(m);
    // console.log(m, 'ssssss')
  };
console.log(messages,'kkkkkkk')
  const sendMessage = () => {
    if (msg && !loading) {
      setLoading(true);
      scV();
      const nr = [...messages, msg];
      // if (!Boolean(msg?._id === "yes" || msg?._id === "no")) {
      //   setSelectedOption((s: any) => [...s, msg._id]);
      // }
      setMessages([...nr]);
      socket.emit("private message", { message: msg });
      setMsg(null);
    }
  };

  useEffect(() => {
    sendMessage();
  }, [msg]);

  useEffect(() => {
    socket.on("private message", ({ messages }) => {
      setMessages((prevMessages: any) => {
        if (window.location.search?.startsWith("?search=")) {
          const msgs = [...prevMessages, ...messages].filter(el => el.type !== "welcome_text")
          return [...msgs]
        } else {
          return [...prevMessages, ...messages]
        }
      });
      setLoading(false);
      scV();
    });
  }, []);

  useEffect(() => {
    if (window?.location.search?.startsWith("?search=")) {
      setTimeout(() => {
        setMessage({
          _id: "search",
          faqtext: getSearchParam("search")
        })
      }, 2000);
    }
  }, [socket])

  const handleRegister = () => {
    socket.emit("register", username);
  };

  useEffect(() => {
    handleRegister();
  }, [username]);

  const handleKeyDown = (e: any) => {
    if (e.keyCode === 13) {
      const y = messages[messages.length - 1]?.options?.find(
        (l: any) =>
          l.faqtext.toLowerCase() === input.current.value.toLowerCase()
      );
      if (selectedOption.includes(y?._id)) {
        setError(
          "We have already provided a response regarding this selection."
        );
      } else if (y) {
        setMessage(y);
      } else {
        setMessage({
          _id: "search",
          faqtext: input.current.value
        })
      }
      input.current.value = "";
    } else {
      setError("");
    }
  };

  const scV = () => {
    setTimeout(() => {
      scrollTop.current?.scrollIntoView({
        behavior: "smooth",
        block: "end",
        inline: "nearest",
      });
      input.current.focus();
    }, 200);
  };

  const handleSticker = (k: any) => {
    console.log(k, "gg")

    if (k.type === "welcome_text") {
      return (
        <div
          className="massage-box recieved"
        >
          <div className="chat_img">
            <img
              src="images/massage.svg"
              alt=""
            />
          </div>
          <div className="chat_onlyImg" style={{ maxWidth: 200 }}>
            <img src="/stickers/hi.png" alt="" style={{ width: "100%" }} />
          </div>
        </div>)
    } else if (k._id === "know_more_options_no") {
      return (
        <div
          className="massage-box recieved"
        >
          <div className="chat_img">
            <img
              src="images/massage.svg"
              alt=""
            />
          </div>
          <div className="chat_onlyImg" style={{ maxWidth: 200 }}>
            <img src="/stickers/bye.png" alt="" style={{ width: "100%" }} />
          </div>
        </div>)
    } else if (k._id.endsWith('_nodata_result')) {
      return (
        <div
          className="massage-box recieved"
        >
          <div className="chat_img">
            <img
              src="images/massage.svg"
              alt=""
            />
          </div>
          <div className="chat_onlyImg" style={{ maxWidth: 200 }}>
            <img src="/stickers/oops.png" alt="" style={{ width: "100%" }} />
          </div>
        </div>)
    }
  }
  return (
    <>
      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes"
        />
      </Head>

      <div className="chat-box">
        <div className="chat_boat customscroll">
          <div className="chat_boat-head ">
            <div className="chat_back-btn">
              <img
                src="images/left-chavron.svg"
                alt=""
              />
            </div>
          </div>
          <div className="chat_body">
            {messages.map((k: any, i: number, s: any) => {
              return k.sender === "bot" ? (
                <React.Fragment key={`message-recieved-${i}`}>
                  {handleSticker(k)}
                  <div
                    className="massage-box recieved">
                    <div className="chat_img">
                      <img
                        src="images/massage.svg"
                        alt=""
                      />
                    </div>
                    <div className="massage">
                      <p>{k.faqtext}</p>

                      {Boolean(k.options?.length) && (
                        <div>
                          <ul className="guided-btns">
                            {k.options.map((el: any, k: number) => (
                              <li key={`op-${k}`}>
                                {
                                  // i == s.length - 1 &&
                                  !Boolean(selectedOption.includes(el._id)) ? (
                                    <button
                                      style={{ margin: 5 }}
                                      onClick={() => setMessage(el)}>
                                      {el.faqtext}
                                    </button>
                                  ) : (
                                    <button
                                      style={{ margin: 5 }}
                                      disabled={true}>
                                      {el.faqtext}
                                    </button>
                                  )}
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                </React.Fragment>

              ) : (
                <div
                  className="massage-box send"
                  key={`message-send-${i}`}>
                  <div className="massage">{k.faqtext}</div>
                </div>
              );
            })}
            {loading && (
              <div
                className="chat-message user2"
                style={{ textAlign: "center" }}
                key={`loading`}>
                Please wait...
              </div>
            )}
            <div ref={scrollTop}></div>
          </div>
          <div className="chat_input-box">
            <input
              className="chat_input"
              type="text"
              ref={input}
              disabled={loading}
              onKeyDown={handleKeyDown}
            />
            {error && (
              <p className="text-danger text-sm position-absolute">{error}</p>
            )}
            <div className="send-btn">
              <img
                src="images/vactor-send.svg"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
