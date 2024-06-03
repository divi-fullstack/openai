import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import "../app/globals.css";
export default function Home() {
  const [chats, setChat]: any = useState([])
  const [msg, setMsg] = useState("")
  const [loading, setLoading] = useState(false)
  const scrollTop:any = useRef() 
  const input:any = useRef() 
  const sendMessage = () => {
    if (msg && !loading) {
      setLoading(true)
      const nr= [...chats, { "role": "user", "content": msg }]
      setChat([...nr])
      getAiResponse(nr)
      scV()
      setMsg("")
    }
  }
  const scV = ()=>{
    setTimeout(() => {
      scrollTop.current?.scrollIntoView({ behavior: "smooth", block: "end", inline: "nearest" });
      input.current.focus()
    }, 200);
  }
  const getAiResponse = async (m:any) => { 
    const response = await fetch(`/api/chat`,{
      method : "POST",
      body: JSON.stringify(m.slice(m.length - 2))
    });
    const chatRes = await response.json()
    setChat((c: any) => ([...c, { "role": "assistant", "content": chatRes.text }]))
    scV()
    setLoading(false)
  }
  
  const formatTextToHtml = (text:string) => {
    const lines = text.split('\n');
    let formattedHtml = '<p>';
  
    lines.forEach((line, index) => {
      if (index === 0) {
        // First line as a paragraph
        formattedHtml += `${line}</p><ul>`;
      } else {
        // Convert options into list items
        const match = line.match(/(\d+)\.\s(.+)/);
        if (match) {
          const optionNumber = match[1];
          const optionText = match[2];
          formattedHtml += `<li>${optionNumber}. ${optionText}</li>`;
        }
      }
    });
  
    formattedHtml += '</ul>';
    return formattedHtml;
  };

  useEffect(()=>{
    setTimeout(()=>{
      input.current.focus()
    },400)
  },[])
  
  return (
    <div className="chat-container">
      <div className="chat-header">
        ChatRLT by Birla Estates
      </div>
      <div className="chat-history">
        {chats.map((el: any, i: number) => {
          return (el.role === "user"
            ?
            <div className="chat-message user1" key={`u-${i}`}>
              <p className="message" dangerouslySetInnerHTML={{ __html: formatTextToHtml(el.content) }}></p>
            </div>
            :
            <div className="chat-message user2" key={`a-${i}`}>
              <p className="message" dangerouslySetInnerHTML={{ __html: formatTextToHtml(el.content) }}></p>
            </div>)
        })}
        {loading && <div className="chat-message user2" key={`loading`}>
          Please wait...
        </div>}
        <div ref={scrollTop}></div>

      </div>
      <div className="chat-input">
        <input value={msg} type="text" ref={input} disabled={loading} placeholder="Type a message..." onChange={(e) => setMsg(e.target.value)} onKeyDown={(e) => { if (e.keyCode == 13) { sendMessage() } }} />
        <button onClick={sendMessage} disabled={loading}>Send</button>
      </div>
    </div>
  );
}
