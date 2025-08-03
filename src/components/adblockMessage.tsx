"use client"
import { useEffect, useState } from 'react';

export default function AdblockMessage() {

    useEffect(() => {
        const checkAdBlock = async () => {
            fetch(
                "https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js",
                { method: "HEAD", mode: "no-cors", cache: "no-store" }
              )
              .catch(err => {
                let msg = document.createElement("div");
                msg.id = "nag";
                msg.style.cssText = "position:fixed;top:0;left:0;z-index:999;box-sizing:border-box;width:100vw;height:100vh;padding:10px;background:rgba(0,0,0,.5);color:#fff;font-size:24px;display:flex;justify-content:center;align-items: center;";
                msg.onclick = () => document.getElementById("nag").remove();
                msg.innerHTML = `
                <div style="width:70%">
                    <h1 style="color:red;font-size:2rem; font-weight:800">!!Ad Block Detected!!</h1>
                    <p>We're offering all movies completely free for your enjoyment. To keep this service running, we rely on ad revenue. Please support us by disabling your ad blocker. Your cooperation means a lot – thank you!</p>
                </div>
                `;
                document.body.appendChild(msg);
              });
        };
        checkAdBlock();
    }, []);

   return<></>
}

