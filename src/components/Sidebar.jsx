import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PlusCircle, Menu, MoreVertical, Check, X } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

const Sidebar = ({ chats, currentChatId, setCurrentChatId, addNewChat, editingChatId, setEditingChatId, handleChatNameEdit, removeChat }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const handleNewChat = () => {
    addNewChat();
  };

  const handleRenameSubmit = (chatId) => {
    handleChatNameEdit(chatId, editedTitle);
    setEditingChatId(null);
  };

  const handleRenameCancel = () => {
    setEditingChatId(null);
  };

  const ChatList = () => (
    <>
      <Button onClick={handleNewChat} className="mb-4 w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> New Chat
      </Button>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div key={chat.id} className="grid grid-cols-[1fr,auto] items-center mb-2 gap-1">
            {editingChatId === chat.id ? (
              <div className="col-span-2 flex items-center w-full">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="mr-2 focus:ring-0 focus:border-transparent"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      handleRenameSubmit(chat.id);
                    } else if (e.key === 'Escape') {
                      handleRenameCancel();
                    }
                  }}
                />
                <Button size="icon" onClick={() => handleRenameSubmit(chat.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={handleRenameCancel}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant={chat.id === currentChatId ? 'secondary' : 'ghost'}
                  className={`justify-start h-9 px-2 ${chat.id === currentChatId ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  <span className="truncate">{chat.title}</span>
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-9 w-9">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => {
                      setEditingChatId(chat.id);
                      setEditedTitle(chat.title);
                    }}>
                      Rename
                    </DropdownMenuItem>
                    <DropdownMenuItem onSelect={() => removeChat(chat.id)}>
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex w-64 bg-secondary p-4 flex-col">
        <ChatList />
      </aside>

      {/* Mobile Menu Button */}
      <div className="md:hidden">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon" className="fixed top-4 left-4 z-50">
              <Menu className="h-[1.2rem] w-[1.2rem]" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-4">
            <ChatList />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
};

export default Sidebar;