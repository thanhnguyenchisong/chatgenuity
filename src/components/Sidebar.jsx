import React, { useState } from 'react';
import { Button } from './ui/button';
import { PlusCircle, Menu, Edit2, Check } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { Input } from './ui/input';

const Sidebar = ({ chats, currentChatId, setCurrentChatId, addNewChat, editingChatId, setEditingChatId, handleChatNameEdit }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editedTitle, setEditedTitle] = useState('');

  const ChatList = () => (
    <>
      <Button onClick={addNewChat} className="mb-4 w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> New Chat
      </Button>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div key={chat.id} className="flex items-center mb-2">
            {editingChatId === chat.id ? (
              <form onSubmit={(e) => {
                e.preventDefault();
                handleChatNameEdit(chat.id, editedTitle);
              }} className="flex w-full">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="mr-2"
                />
                <Button type="submit" size="icon" variant="ghost">
                  <Check className="h-4 w-4" />
                </Button>
              </form>
            ) : (
              <>
                <Button
                  variant={chat.id === currentChatId ? 'secondary' : 'ghost'}
                  className="flex-grow justify-start"
                  onClick={() => {
                    setCurrentChatId(chat.id);
                    setIsMobileMenuOpen(false);
                  }}
                >
                  {chat.title}
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={() => {
                    setEditingChatId(chat.id);
                    setEditedTitle(chat.title);
                  }}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
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