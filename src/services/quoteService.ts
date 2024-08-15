import axios from 'axios';

export const getRandomQuote = async (): Promise<string> => {
  try {
    const response = await axios.get('https://api.quotable.io/random');
    return response.data.content;
  } catch (error) {
    return 'Could not fetch quote. Please try again later.';
  }
};
