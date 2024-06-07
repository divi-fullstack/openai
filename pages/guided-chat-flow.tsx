import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "../app/globals.css";
export default function Home() {
  const [chats, setChat]: any = useState([])
  const [msg, setMsg] = useState({ id: "", message: "" })
  const [loading, setLoading] = useState(false)
  const scrollTop: any = useRef()
  // const input:any = useRef() 
  const sendMessage = () => {
    if (msg.id && !loading) {
      setLoading(true)
      const nr = [...chats, { "role": "user", "content": msg }]
      setChat([...nr])
      getAiResponse(nr, "choose")
      scV()
      setMsg({ id: "", message: "" })
    }
  }
  const scV = () => {
    setTimeout(() => {
      scrollTop.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      // input.current.focus()
    }, 200);
  }
  const getAiResponse = async (m: any, stage: string) => {
    const response = await fetch(`/api/guided-chat`, {
      method: "POST",
      body: JSON.stringify({
        messages: m,
        stage
      })
    });
    const chatRes = await response.json()
    setChat((c: any) => ([...c, { "role": "assistant", "content": chatRes }]))
    if (stage === "start") {
      getAiResponse(chats, "afterstart")
    }
    scV()
    setLoading(false)
  }

  // const formatTextToHtml = (text:string) => {
  //   const lines = text.split('\n');
  //   let formattedHtml = '<p>';

  //   lines.forEach((line, index) => {
  //     if (index === 0) {
  //       // First line as a paragraph
  //       formattedHtml += `${line}</p><ul>`;
  //     } else {
  //       // Convert options into list items
  //       const match = line.match(/(\d+)\.\s(.+)/);
  //       if (match) {
  //         const optionNumber = match[1];
  //         const optionText = match[2];
  //         formattedHtml += `<li>${optionNumber}. ${optionText}</li>`;
  //       }
  //     }
  //   });

  //   formattedHtml += '</ul>';
  //   return formattedHtml;
  // };
  const setMessage = (m: any) => {
    setMsg({ id: m.id, message: m.option })
  }
  useEffect(() => {
    sendMessage()
  }, [msg])

  useEffect(() => {
    getAiResponse(chats, "start")
  }, [])
  console.log("chatRes0", chats)
  return (
    <div className="chat-container">
      <div className="chat-header">
        ChatRLT by Birla Estates
      </div>
      <div className="chat-history">
        {chats.map((el: any, i: number, s: any) => {
          return (el.role === "user"
            ?
            <div className="chat-message user1" key={`u-${i}`}>
              <div className="message">{el.content.message}</div>
            </div>
            :
            <div className="chat-message user2" key={`a-${i}`}>
              <div className="message" style={{ marginBottom: 5 }}>
                <p>{el.content.message}</p>
              </div>
              {Boolean(el.content.options?.length)
                && <div className="message">
                  {Boolean(el.content.optionTitle) && <p>{el.content.optionTitle}</p>}
                  <ul>
                    {el.content.options.map((el: any) => (<li>
                      {i == s.length - 1
                        ?
                        <button style={{ margin: 5 }} onClick={() => setMessage(el)}>{el.option}</button>
                        :
                        <button style={{ margin: 5 }} disabled={true}>{el.option}</button>}
                    </li>))}
                  </ul>
                </div>}
            </div>)
        })}
        {loading && <div className="chat-message user2" key={`loading`}>
          Please wait...
        </div>}
        <div ref={scrollTop}></div>

      </div>
      {/* <div className="chat-input">
        <input value={msg} type="text" ref={input} disabled={loading} placeholder="Type a message..." onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => { if (e.keyCode == 13) { sendMessage() } }} />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div> */}
    </div>
  );
}
