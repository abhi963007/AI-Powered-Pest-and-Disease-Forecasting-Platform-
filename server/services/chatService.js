const axios = require('axios');

/**
 * Expert Agricultural Chat Advisor powered by Groq (LLaMA 3)
 */
const getAIChatResponse = async (message, diseaseContext = null, history = []) => {
    const groqKey = process.env.GROQ_API_KEY;

    if (!groqKey) {
        console.warn('GROQ_API_KEY missing. Falling back to simple response.');
        return `I'm currently in basic mode. Regarding ${diseaseContext || 'your plant'}, please ensure you follow the recommended treatment and maintain consistent soil health.`;
    }

    try {
        const systemPrompt = `
            You are "AgroScan AI", a brilliant and empathetic agricultural scientist. 
            The user has just performed a diagnostic scan on their crops.
            CURRENT DIAGNOSIS: ${diseaseContext || 'Unknown/General Plant Health'}.
            
            Your goal is to:
            1. Provide expert, scientifically-backed advice on organic and chemical treatments.
            2. Explain why this disease occurs in clear, farmer-friendly terms.
            3. Suggest preventive measures for the next harvest.
            4. Keep responses concise and encouraging.
            5. If the user asks non-agricultural questions, politely steer them back to plant health.
        `;

        const messages = [
            { role: "system", content: systemPrompt },
            ...history.slice(-6), // Keep recent context
            { role: "user", content: message }
        ];

        const response = await axios.post("https://api.groq.com/openai/v1/chat/completions", {
            model: "llama-3.3-70b-versatile", // Updated model 
            messages: messages,
            temperature: 0.7
        }, {
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${groqKey}`
            }
        });

        return response.data.choices[0].message.content;
    } catch (e) {
        console.error('Groq AI API error:', e.response?.data || e.message);
        return "I'm having trouble connecting to my central neural network. Please check the treatment plan above for immediate steps.";
    }
};

module.exports = { getAIChatResponse };
