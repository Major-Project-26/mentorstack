'use client'
import React, { useState } from "react";
import Layout from "../../components/Layout";
import { Paperclip, Image as ImageIcon, Smile } from "lucide-react";

const ChatsPage = () => {
    const [selectedChat, setSelectedChat] = useState<number | null>(null);
    const [message, setMessage] = useState("");

    // Sample chats
    const chats = [
        {
            id: 1,
            name: "Nidhish Shettigar",
            avatar: "NS",
            lastMessage: "Hey, let’s connect tomorrow!",
            time: "10:45 AM",
            messages: [
                { from: "mentor", text: "Hi, how can I help you?", time: "10:00 AM" },
                { from: "me", text: "I wanted to know more about Flutter.", time: "10:15 AM" },
                { from: "mentor", text: "Sure! We can discuss that.", time: "10:30 AM" },
            ],
        },
        {
            id: 2,
            name: "Sanidhya K Bhandary",
            avatar: "SB",
            lastMessage: "I’ll send you the Selenium docs.",
            time: "Yesterday",
            messages: [
                { from: "mentor", text: "Hello!", time: "5:00 PM" },
                { from: "me", text: "Can you guide me with testing?", time: "5:10 PM" },
                { from: "mentor", text: "Absolutely, I’ll share resources.", time: "5:15 PM" },
            ],
        },
    ];

    const handleSend = () => {
        if (!message.trim() || selectedChat === null) return;

        const chatIndex = chats.findIndex((c) => c.id === selectedChat);
        chats[chatIndex].messages.push({
            from: "me",
            text: message,
            time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        });
        setMessage("");
    };

    return (
        <Layout>
            <div className="h-full bg-neutral-50 flex items-center justify-center p-1">
                <div className="w-full max-w-7xl h-5/6 flex border border-gray-200 rounded-2xl overflow-hidden shadow-sm">

                    {/* Chat List */}
                    <div className="w-1/3 border-r border-gray-200 flex flex-col" style={{ backgroundColor: "var(--color-neutral)" }}>
                        {/* Search bar */}
                        <div className="p-4 border-b border-gray-200">
                            <input
                                type="text"
                                placeholder="Search chats"
                                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                style={{ backgroundColor: "var(--color-surface)" }}
                            />
                        </div>

                        {/* Chats */}
                        <div className="flex-1 overflow-y-auto">
                            {chats.map((chat) => (
                                <div
                                    key={chat.id}
                                    onClick={() => setSelectedChat(chat.id)}
                                    className={`flex items-center px-4 py-3 cursor-pointer border-b border-gray-200 hover:bg-gray-100 ${
                                        selectedChat === chat.id ? "bg-gray-100" : ""
                                    }`}
                                >
                                    {/* Avatar */}
                                    <div className="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold mr-3"
                                        style={{ backgroundColor: "var(--color-primary)" }}>
                                        {chat.avatar}
                                    </div>
                                    {/* Chat Info */}
                                    <div className="flex-1">
                                        <div className="flex justify-between">
                                            <h3 className="text-sm font-semibold text-gray-900">{chat.name}</h3>
                                            <span className="text-xs text-gray-500">{chat.time}</span>
                                        </div>
                                        <p className="text-xs text-gray-600 truncate">{chat.lastMessage}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Chat Window */}
                    <div className="flex-1 flex flex-col" style={{ backgroundColor: "var(--color-neutral)" }}>
                        {selectedChat ? (
                            <>
                                {/* Chat Header */}
                                <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
                                    <div className="flex items-center space-x-3">
                                        <div className="w-10 h-10 flex items-center justify-center rounded-full text-white font-semibold"
                                             style={{ backgroundColor: "var(--color-primary)" }}>
                                            {chats.find((c) => c.id === selectedChat)?.avatar}
                                        </div>
                                        <h2 className="text-lg font-semibold text-gray-900">
                                            {chats.find((c) => c.id === selectedChat)?.name}
                                        </h2>
                                    </div>
                                    <div className="flex space-x-4 text-gray-600">
                                        <button><Paperclip size={20} /></button>
                                        <button><ImageIcon size={20} /></button>
                                    </div>
                                </div>

                                {/* Date Divider */}
                                <div className="text-center text-xs text-gray-500 mt-3">Today</div>

                                {/* Messages */}
                                <div className="flex-1 p-6 overflow-y-auto space-y-4">
                                    {chats.find((c) => c.id === selectedChat)?.messages.map((msg, index) => (
                                        <div key={index} className={`flex ${msg.from === "me" ? "justify-end" : "justify-start"}`}>
                                            <div className="max-w-xs">
                                                <div
                                                    className={`px-4 py-2 rounded-lg text-sm relative ${
                                                        msg.from === "me" ? "text-white" : "text-gray-900"
                                                    }`}
                                                    style={{
                                                        backgroundColor:
                                                            msg.from === "me"
                                                                ? "var(--color-primary)"
                                                                : "var(--color-surface)",
                                                    }}
                                                >
                                                    {msg.text}
                                                    <span className="block text-[10px] mt-1 text-gray-400 text-right">
                                                        {msg.time}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Input */}
                                <div className="p-4 border-t border-gray-200 flex items-center space-x-2">
                                    <button className="text-gray-500"><Smile size={20} /></button>
                                    <button className="text-gray-500"><Paperclip size={20} /></button>
                                    <input
                                        type="text"
                                        placeholder="Type a message"
                                        value={message}
                                        onChange={(e) => setMessage(e.target.value)}
                                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-teal-500"
                                        style={{ backgroundColor: "var(--color-surface)" }}
                                    />
                                    <button
                                        onClick={handleSend}
                                        className="px-4 py-2 rounded-lg text-white font-medium hover:opacity-90 transition-opacity"
                                        style={{ backgroundColor: "var(--color-primary)" }}
                                    >
                                        Send
                                    </button>
                                </div>
                            </>
                        ) : (
                            <div className="flex-1 flex items-center justify-center text-gray-500">
                                Select a chat to start messaging
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ChatsPage;
