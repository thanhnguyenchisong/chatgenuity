import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { PlusCircle, Menu, MoreVertical, Check, X, FileText, Upload } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";

const Sidebar = ({ chats, currentChatId, setCurrentChatId, addNewChat, handleChatNameEdit, removeChat, setCurrentView, openUploadModal }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [editingChatId, setEditingChatId] = useState(null);
  const [editedTitle, setEditedTitle] = useState('');

  const handleRenameSubmit = (chatId) => {
    handleChatNameEdit(chatId, editedTitle);
    setEditingChatId(null);
  };

  const handleChatSelect = (chatId) => {
    setCurrentChatId(chatId);
    setCurrentView('chat');
    setIsMobileMenuOpen(false);
  };

  const handleDocumentsClick = () => {
    setCurrentView('documents');
    setIsMobileMenuOpen(false);
  };

  const handleUploadClick = () => {
    openUploadModal();
    setIsMobileMenuOpen(false);
  };

  const ChatList = () => (
    <>
      <Button onClick={addNewChat} className="mb-4 w-full">
        <PlusCircle className="mr-2 h-4 w-4" /> New Chat
      </Button>
      <div className="flex-1 overflow-y-auto">
        {chats.map((chat) => (
          <div key={chat.id} className="flex items-center mb-2">
            {editingChatId === chat.id ? (
              <div className="flex items-center w-full">
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="mr-2"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleRenameSubmit(chat.id);
                    else if (e.key === 'Escape') setEditingChatId(null);
                  }}
                />
                <Button size="icon" onClick={() => handleRenameSubmit(chat.id)}>
                  <Check className="h-4 w-4" />
                </Button>
                <Button size="icon" variant="ghost" onClick={() => setEditingChatId(null)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : (
              <>
                <Button
                  variant={chat.id === currentChatId ? 'secondary' : 'ghost'}
                  className={`flex-grow justify-start ${chat.id === currentChatId ? 'bg-gray-200 dark:bg-gray-700' : ''}`}
                  onClick={() => handleChatSelect(chat.id)}
                >
                  {chat.name}
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem onSelect={() => {
                      setEditingChatId(chat.id);
                      setEditedTitle(chat.name);
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
      <div className="mt-4">
        <Button variant="ghost" className="w-full justify-start mb-2" onClick={handleDocumentsClick}>
          <FileText className="mr-2 h-4 w-4" />
          <span>Documents</span>
        </Button>
        <Button variant="ghost" className="w-full justify-start" onClick={handleUploadClick}>
          <Upload className="mr-2 h-4 w-4" />
          <span>Upload</span>
        </Button>
      </div>
    </>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 bg-secondary p-4 flex-col">
        <ChatList />
      </aside>
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