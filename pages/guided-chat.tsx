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
  const [height, setHeight] = useState(0);
  const [messages, setMessages]: any = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOption, setSelectedOption]: any = useState([]);
  const [error, setError] = useState("");
  const scrollTop: any = useRef();
  const input: any = useRef();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setHeight(window.innerHeight * 0.9);
      const handleResize = () => {
        setHeight(window.innerHeight * 0.9);
      };
      window.addEventListener('resize', handleResize);
      return () => {
        window.removeEventListener('resize', handleResize);
      };
    }
  }, []);

  const setMessage = (m: any) => {
    setError("");
    m.sender = "user";
    if (!m?.refFrom) {
      m.refFrom = messages?.[messages?.length - 2]?.refFrom || null
    }
    setMsg(m);
    // console.log(m, 'ssssss')
  };
  console.log(messages, 'kkkkkkk')
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

  const getLastSendMessageId = () => {
    const sm = messages?.filter((el: any) => el.sender === "user")
    const lsm = sm.pop()
    return lsm?._id || null
  }


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
    if (e.keyCode === 13 || e === "submit") {
      if (!input.current.value) {
        return
      }
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
        block: "start",
        inline: "nearest",
      });
      // input.current.focus();
    }, 500);
  };

  const handleSticker = (k: any) => {

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
          <div className="chat_onlyImg">
            <img src="/stickers/hi.png" alt="" style={{ width: "100px" }} />
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
          <div className="chat_onlyImg">
            <img src="/stickers/bye.png" alt="" style={{ width: "100px" }} />
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
          <div className="chat_onlyImg">
            <img src="/stickers/oops.png" alt="" style={{ width: "100px" }} />
          </div>
        </div>)
    }
  }
  return (
    <>
      <img src="/stickers/bye.png" hidden={true} />
      <img src="/stickers/great_question.png" hidden={true} />
      <img src="/stickers/happy_home_buying.png" hidden={true} />
      <img src="/stickers/here_you_go.png" hidden={true} />
      <img src="/stickers/hi.png" hidden={true} />
      <img src="/stickers/hope_that_helped.png" hidden={true} />
      <img src="/stickers/let_me_think.png" hidden={true} />
      <img src="/stickers/oops.png" hidden={true} />
      <img src="/stickers/wait.png" hidden={true} />

      <Head>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=yes"
        />
      </Head>

      <div className="chat-box">
        <div className="chat_boat">
          <div className="chat_boat-head ">
            <div className="chat_back-btn">
              <img
                src="images/left-chavron.svg"
                alt=""
              />
            </div>
          </div>
          <div className="chat_body customscroll" style={{ height: `${height}px` }}>
            {messages.map((k: any, i: number, s: any) => {
              return k.sender === "bot" ? (
                <React.Fragment key={`message-recieved-${i}`}>
                  {(getLastSendMessageId() === k?._id) ? <div ref={scrollTop} style={{ position: "relative", top: -80 }}></div> : ""}
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
                      {k.prevFaqdesc ? <div dangerouslySetInnerHTML={{ __html: k.prevFaqdesc }}></div> : ""}
                      <div dangerouslySetInnerHTML={{ __html: k.faqtext }}></div>
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
                <React.Fragment>
                  {(getLastSendMessageId() === k?._id) ? <div ref={scrollTop} style={{ position: "relative", top: -80 }}></div> : ""}

                  <div
                    className="massage-box send"
                    key={`message-send-${i}`}>
                    <div className="massage" dangerouslySetInnerHTML={{ __html: k.faqtext }}></div>
                  </div>
                </React.Fragment>
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
            {/* <div ref={scrollTop} className="refer_div"></div> */}
          </div>
          <div className="chat_input-box-container">
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
              <div className="send-btn" onClick={() => handleKeyDown("submit")}>
                <img
                  src="images/vactor-send.svg"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
