import React, { useState } from 'react';
import { Send, Paperclip, Search, MoreVertical, Phone, Video } from 'lucide-react';

export default function Chat() {
  const [selectedChat, setSelectedChat] = useState(null);
  const [message, setMessage] = useState('');

  const chats = [
    {
      id: 1,
      name: 'محمد أحمد',
      lastMessage: 'شكراً دكتور على المتابعة',
      time: '10:30 ص',
      unread: 2,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop',
      messages: [
        { id: 1, text: 'مرحباً دكتور', sender: 'user', time: '10:25 ص' },
        { id: 2, text: 'أهلاً بك، كيف يمكنني مساعدتك؟', sender: 'doctor', time: '10:26 ص' },
        { id: 3, text: 'أريد استشارة بخصوص نتائج التحاليل', sender: 'user', time: '10:28 ص' },
        { id: 4, text: 'تفضل، يمكنك إرسال صورة التحاليل', sender: 'doctor', time: '10:29 ص' },
        { id: 5, text: 'شكراً دكتور على المتابعة', sender: 'user', time: '10:30 ص' },
      ]
    },
    {
      id: 2,
      name: 'سارة خالد',
      lastMessage: 'موعد المتابعة غداً الساعة 11 صباحاً',
      time: '9:45 ص',
      unread: 0,
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop',
      messages: [
        { id: 1, text: 'السلام عليكم دكتور', sender: 'user', time: '9:40 ص' },
        { id: 2, text: 'وعليكم السلام', sender: 'doctor', time: '9:41 ص' },
        { id: 3, text: 'موعد المتابعة غداً الساعة 11 صباحاً', sender: 'doctor', time: '9:45 ص' },
      ]
    }
  ];

  return (
    <div className="flex h-[calc(100vh-12rem)] bg-white dark:bg-gray-800 rounded-xl shadow-sm overflow-hidden">
      {/* Chats List */}
      <div className="w-1/3 border-l dark:border-gray-700">
        <div className="p-4 border-b dark:border-gray-700">
          <div className="relative">
            <input
              type="text"
              placeholder="بحث في المحادثات..."
              className="w-full px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={20} />
          </div>
        </div>
        <div className="overflow-y-auto h-[calc(100%-4rem)]">
          {chats.map((chat) => (
            <button
              key={chat.id}
              onClick={() => setSelectedChat(chat)}
              className={`w-full text-right p-4 border-b dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 ${selectedChat?.id === chat.id ? 'bg-gray-50 dark:bg-gray-700' : ''
                }`}
            >
              <div className="flex items-center space-x-4 space-x-reverse">
                <img
                  src={chat.avatar}
                  alt={chat.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <h3 className="font-semibold text-gray-800 dark:text-white truncate">
                      {chat.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400 whitespace-nowrap">
                      {chat.time}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
                    {chat.lastMessage}
                  </p>
                </div>
                {chat.unread > 0 && (
                  <span className="bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unread}
                  </span>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      {selectedChat ? (
        <div className="flex-1 flex flex-col">
          {/* Chat Header */}
          <div className="p-4 border-b dark:border-gray-700 flex justify-between items-center">
            <div className="flex items-center space-x-4 space-x-reverse">
              <img
                src={selectedChat.avatar}
                alt={selectedChat.name}
                className="w-10 h-10 rounded-full object-cover"
              />
              <div>
                <h3 className="font-semibold text-gray-800 dark:text-white">
                  {selectedChat.name}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">متصل الآن</p>
              </div>
            </div>
            <div className="flex items-center space-x-2 space-x-reverse">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Phone size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Video size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <MoreVertical size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {selectedChat.messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.sender === 'doctor' ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[70%] rounded-lg p-3 ${msg.sender === 'doctor'
                      ? 'bg-gray-100 dark:bg-gray-700'
                      : 'bg-indigo-600 text-white'
                    }`}
                >
                  <p>{msg.text}</p>
                  <span className={`text-xs mt-1 block ${msg.sender === 'doctor'
                      ? 'text-gray-500 dark:text-gray-400'
                      : 'text-indigo-100'
                    }`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Message Input */}
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex items-center space-x-4 space-x-reverse">
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Paperclip size={20} className="text-gray-500 dark:text-gray-400" />
              </button>
              <input
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="اكتب رسالتك..."
                className="flex-1 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 dark:bg-gray-900 dark:text-white"
              />
              <button className="p-2 bg-indigo-600 hover:bg-indigo-700 rounded-full">
                <Send size={20} className="text-white" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center text-gray-500 dark:text-gray-400">
          اختر محادثة للبدء
        </div>
      )}
    </div>
  );
}
