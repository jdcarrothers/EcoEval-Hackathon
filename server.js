const axios = require('axios');
const cheerio = require('cheerio');
const express = require('express');
const OpenAI = require('openai');
const bodyParser = require('body-parser');
require('dotenv').config();
const cors = require('cors');
const app = express();
app.use(cors())
app.use(bodyParser.json());
const port = 3090;

async function getFeatureBulletsFromPage(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        productDetailsDescription = $('#feature-bullets').text().trim();
        return productDetailsDescription;
    } catch (error) {
        console.error('Error fetching HTML:', error);
    }
}

async function getTitleConentFromPage(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        productDetailsTitle = $('#title').text().trim();
        return productDetailsTitle;
    } catch (error) {
        console.error('Error fetching HTML:', error);
    }
}

async function getManufactureContent(url) {
    try {
        const response = await axios.get(url);
        const html = response.data;
        const $ = cheerio.load(html);
        productDetailsManufacturingDetails = $('#productDetails_techSpec_section_1').text().trim();
        return productDetailsManufacturingDetails;
    } catch (error) {
        console.error('Error fetching HTML:', error);
    }
}
const openai = new OpenAI({apiKey: '//not today!'});

async function getProductSustainabilityInfo(productDetailsTitle, productDetailsDescription, productDetailsManufacturingDetails) {
    const evaluation = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [{
        role: "system",
        content: `Provide a concise sustainability evaluation and rating based on the title, description, and manufacturing details of the product. Focus on the most impactful factors: materials used, carbon footprint, water and energy efficiency, recyclability, and lifecycle. Rate lower for non-recyclable plastics, high energy manufacturing, and non-renewable resource usage. Give a rating from 0 to 100%, where 100% is the most sustainable. Justify the rating briefly, prioritizing key sustainability factors.
        
        **Product Title:** ${productDetailsTitle}
        **Description:** ${productDetailsDescription}
        **Manufacturing Details:** ${productDetailsManufacturingDetails}

        Provide a succinct sustainability rating and justification, focusing on key points in a concise manner. Format the response as:
        {
            "Rating": "<Rating 1-100>",
            "Reasoning": "<Brief justification highlighting key points>"
        }`
        }]
    });
    const parsedResponse = JSON.parse(evaluation.choices[0].message.content);

    if (parsedResponse.Reasoning.includes('non-recyclable plastic')) {
        parsedResponse.Rating = Math.min(parsedResponse.Rating, 20);
    }

    console.log(parsedResponse);
    return parsedResponse;
}
    


//methods^^^^^^
app.post('/evaluate-product', async (req, res) => {
    try {
        const { url } = req.body;
        console.log(url)
        title = await getTitleConentFromPage(url)
        console.log(title)
        bullet = await getFeatureBulletsFromPage(url)
        console.log(bullet)
        manu = await getManufactureContent(url)
        console.log(manu)
        reponse = await getProductSustainabilityInfo(title , bullet , manu);
        console.log(reponse)
            // reponse={
            //     Rating: 50,
            //     Reasoning: "The product is made from recyclable materials ed."
            // }
        res.status(202).send(reponse);
    } catch (error) {
        console.error('Error evaluating product:', error);
        return null;
    }
}
);
app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});  