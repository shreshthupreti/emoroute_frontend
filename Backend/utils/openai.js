//webrtc
import "dotenv/config";

const getOpenAIAPIResponse = async (message) => {
    const options = {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`
        },
        body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
                {
                    role: "user",
                    content: message
                }
            ]
        })
    };

    try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", options);
        const data = await response.json();

        if (!data.choices || !data.choices[0] || !data.choices[0].message) {
            console.error("Invalid API response:", data);
            return "Sorry, I couldn’t generate a reply.";
        }

        return data.choices[0].message.content;
    } catch (err) {
        console.error("OpenAI API error:", err);
        return "Sorry, something went wrong with AI response.";
    }
};

export default getOpenAIAPIResponse;
