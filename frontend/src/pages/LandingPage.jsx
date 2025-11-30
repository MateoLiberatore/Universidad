import React from "react";
import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";
import LoginContainer from "../features/authentication/LoginContainer";
import Card from "../components/elements/Card";
import Socials from "../components/elements/Socials"; 

function LandingPage() {
  const { user, isInitialized } = useAuth();

  const githubLinks = {
    backend: "https://github.com/MateoLiberatore/practicas-profesionalizantes-3/tree/main/fp/backend", 
    frontend: "https://github.com/MateoLiberatore/practicas-profesionalizantes-3/tree/main/fp/frontend", 
  };

  if (!isInitialized) {
    return <div className="text-center text-primary-300 mt-10">Loading...</div>;
  }

  if (user) {
    return <Navigate to="/analysis" replace />;
  }

  return (
    
    <div className="flex items-center min-h-screen  bg-secondary-800">
     
        <LoginContainer /> 
  
        <div className="w-1/2 ml-30 ">
          
          <div className="grid grid-cols-3 gap-8">
            <Card 
              title="API Docs" 
              link="/docs" 
              className=""
              description="Explora todos los endpoints, métodos, parámetros y respuestas de la API REST para análisis bibliométrico." 
            />
            <Card 
              title="BackEnd - GitHub" 
              link={githubLinks.backend} 
              className=""
              description="Accede al código fuente del servidor (Flask/Python) y modelos de IA para análisis bibliométrico." 
            />
            <Card 
              title="FrontEnd - GitHub" 
              link={githubLinks.frontend} 
              className=""
              description="Explora el código de la interfaz de usuario (React/Tailwind CSS) para análisis bibliométrico." 
            />
          </div>

          <div className="mt-8 w-full mx-auto">
            <Socials />
          </div>
        </div>
    
    </div>
  );
}

export default LandingPage;