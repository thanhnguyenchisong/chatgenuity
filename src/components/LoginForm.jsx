import React from 'react';
import { Button } from './ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';

const LoginForm = ({ onLogin }) => {
  return (
    <Card className="w-[350px]">
      <CardHeader>
        <CardTitle>Welcome to ChatWhirl</CardTitle>
      </CardHeader>
      <CardContent>
        <p>Please log in to continue</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onLogin}>Login with Keycloak</Button>
      </CardFooter>
    </Card>
  );
};

export default LoginForm;