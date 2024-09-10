const useGetMerchantsByUserId = () => {
  const handleRequestMerchant = async () => {
    try {
      const response = await fetch(`/api/merchant`, {
        method: "GET",
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (error) {
      console.log(error);
    }
  };

  return {
    handleRequestMerchant,
  };
};

export default useGetMerchantsByUserId;
