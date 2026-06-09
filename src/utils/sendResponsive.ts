type tokenType = {
  accessToken?: string;
};

const sendResponsive = (data: any, message: string, token?: tokenType) => {
  return { status: 'success', message, data, token };
};
export default sendResponsive;
