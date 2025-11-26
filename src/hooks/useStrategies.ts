import { UserDetailContext } from "@/context/UserDetailContext";
import ModuleService from "@/services/moduleService";
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";

export const useStrategies = () => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useContext(UserDetailContext);
  const navigate = useNavigate();

  if (!context) {
    throw new Error(
      "UserDetailContext must be used within a UserDetailProvider"
    );
  }

  const { userDetail } = context;

  const handleSaveStrategy = async (data: any) => {
    try {
      setIsLoading(true);
      data.user = userDetail?.id;
      data.date = new Date().toISOString();
      const strategy = await ModuleService.strategies.create(data);
      return strategy;
    } catch (error) {
      console.error("Save strategy error:", error);
      throw error;
    } finally {
      setIsLoading(false);
      navigate("/strategies", { replace: true });
    }
  };


  const getStrategies = async () => {
    try {
      setIsLoading(true);
      const strategies = await ModuleService.strategies.byUser("user", userDetail?.id || "");
      return strategies;
    } catch (error) {
      console.error("Get strategies error:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };


  return { handleSaveStrategy, isLoading, getStrategies };
};