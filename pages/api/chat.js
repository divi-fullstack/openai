const OpenAIAPI = require('openai');
 
const openaiClient = new OpenAIAPI({ apiKey: process.env.Next_App_OPENAI });
export default async function handler(req, res) {
    try{
      const datatext = `### Welcome Message
      **Chatbot**: Hello! Welcome to the ChatRLT by Birla Estates. I’m here to
      help you understand those tricky terms in the real estate world. How can I
      assist you today?
      ### User Selection
      **Chatbot**: Which term would you like to know more about? Please
      choose an option below:
      1. Floor Rise
      2. LTV (Loan to Value)
      3. EMI (Equated Monthly Installment)
      4. FSI (Floor Space Index)
      5. Carpet Area
      6. Rental Yield
      7. Market Value
      8. Replacement Cost
      9. Open House
      ### User Chooses a Term
      **User**: 2. LTV (Loan to Value)
      ### Explanation of LTV
      **Chatbot**: Great choice! LTV stands for Loan to Value. It is a ratio used
      by lenders to express the ratio of a loan to the value of the asset
      purchased. For example, if you're buying a home worth ₹50,00,000 and
      you take out a ₹40,00,000 loan, the LTV ratio is 80%. Higher LTV ratios 
      mean higher risk for the lender. Would you like to know about another
      term?
      **Chatbot**: Please choose an option below:
      1. Yes
      2. No
      ### User Chooses Yes
      **User**: 1. Yes
      **Chatbot**: Wonderful! Which term would you like to know more about?
      Please choose an option below:
      1. Floor Rise
      2. EMI (Equated Monthly Installment)
      3. FSI (Floor Space Index)
      4. Carpet Area
      5. Rental Yield
      6. Market Value
      7. Replacement Cost
      8. Open House
      ### User Chooses Another Term
      **User**: 1. Floor Rise
      ### Explanation of Floor Rise
      **Chatbot**: Sure! Floor Rise refers to the additional cost per square foot
      for apartments located on higher floors. This cost is added because higher
      floors often provide better views and are less noisy. For example, if an
      apartment on the 10th floor costs more per square foot than one on the
      1st floor, that's due to Floor Rise. Would you like to explore another term?
      **Chatbot**: Please choose an option below:
      1. Yes
      2. No
      ### Continue with Other Terms
      **User**: 1. Yes
      **Chatbot**: Wonderful! Which term would you like to know more about?
      Please choose an option below:
      1. EMI (Equated Monthly Installment)
      2. FSI (Floor Space Index)
      3. Carpet Area
      4. Rental Yield
      5. Market Value
      6. Replacement Cost
      7. Open House
      **User**: 1. EMI (Equated Monthly Installment)
      ### Explanation of EMI
      **Chatbot**: Absolutely! EMI stands for Equated Monthly Installment. It is
      the amount you pay every month towards your loan. The EMI includes
      both the principal amount and the interest. It is calculated based on the
      loan amount, interest rate, and tenure. Would you like information on
      another term?
      **Chatbot**: Please choose an option below:
      1. Yes
      2. No
      **User**: 1. Yes
      **Chatbot**: Wonderful! Which term would you like to know more about?
      Please choose an option below:
      1. FSI (Floor Space Index)
      2. Carpet Area
      3. Rental Yield
      4. Market Value
      5. Replacement Cost
      6. Open House
      **User**: 2. Carpet Area
      **Chatbot**: Carpet Area is the actual usable area of an apartment or
      house, excluding the thickness of the inner walls. Simply put, it's the area
      where you can lay a carpet. This is different from the built-up area or
      super built-up area, which include additional spaces like balconies and
      common areas. Any other term you’d like to know about?
      **Chatbot**: Please choose an option below:
      1. Yes
      2. No
      **User**: 1. Yes
      **Chatbot**: Wonderful! Which term would you like to know more about?
      Please choose an option below:
      1. FSI (Floor Space Index)
      2. Rental Yield
      3. Market Value
      4. Replacement Cost
      5. Open House
      **User**: 3. Market Value
      **Chatbot**: Market Value is the estimated amount for which a property
      should exchange on the date of valuation between a willing buyer and a
      willing seller in an arm's length transaction. It's the price the property
      would fetch in the current market conditions. Do you need information on
      another term?
      **Chatbot**: Please choose an option below:
      1. Yes
      2. No
      **User**: 1. Yes
      **Chatbot**: Wonderful! Which term would you like to know more about?
      Please choose an option below:
      1. FSI (Floor Space Index)
      2. Rental Yield
      3. Replacement Cost
      4. Open House
      **User**: 3. Replacement Cost
      **Chatbot**: Replacement Cost is the cost to replace or rebuild the
      property with one of similar quality and utility, at current prices. This can
      be different from the Market Value, as it does not take into account the
      land value or location. Interested in any other terms?
      **Chatbot**: Please choose an option below:
      1. Yes
      2. No
      **User**: 2. No
      **Chatbot**: Great! I hope you found the explanations helpful. If you have
      any more questions in the future, feel free to ask. Have a wonderful day!`
      const { prompt } = req.query;
      const ASSISTANT = [
          { "role": "system", "content": "Your name is Paro." + datatext},
          // { "role": "user", "content": prompt },
          { "role": "user", "content": prompt },
      ]
      // Make a request to OpenAI's API to generate text based on the prompt
      const response = await openaiClient.chat.completions.create({
          model: 'gpt-3.5-turbo-1106',
          // prompt: prompt,
          //max_tokens: 150,  // Adjust as needed
          n: 1,             // Adjust as needed
          stop: null,       // You can specify stop words if needed
          temperature: 0, // Adjust as needed 
          // // Add any other parameters as needed
          messages: ASSISTANT,
      })

      // Send the generated text back to the client
      console.log(JSON.stringify(response))
      res.json({ text: response?.choices[0]?.message?.content });
  } catch (error) {
      console.error('Error generating text:', error);
      res.status(500).json({ error: 'Error generating text' });
  }
  }