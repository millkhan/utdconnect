import * as cheerio from 'cheerio';

const DIRECTORY_URL = 'https://websvcs.utdallas.edu/directory/includes/directories.class.php'

function generate_query_string(email) {
    const params = new URLSearchParams({
        dirType: 'email',
        dirSearch: email,
        dirAffil: 'student',
        dirDept: 'All',
        dirMajor: 'All',
        dirDept: 'All',
    });

    return `${DIRECTORY_URL}?${params.toString()}`;
};

const extract_student_data = function($el) {
    const extracted = $el('#page1').extract({
        full_name: '.fullname',
        email: "a[href^='mailto:']",
        year: "p:contains('Year')",
        major: "p:contains('Major')",
        school: "p:contains('School')"
    });

    if (typeof extracted.email === 'undefined') 
        return {};

    const result = {};
    for (const [key, value] of Object.entries(extracted)) {
        result[key] = typeof value === 'string' && value.includes(':') ? value.split(':')[1].trim() : value;
    }
    
    if (result.email) 
        result.email = result.email.toLowerCase();

    return result;
}

const get_student_data = async (email) => {
    const query_string = generate_query_string(email);
    const response = await fetch(query_string);
    const raw_text = await response.text();
    const $ = cheerio.load(raw_text);

    return extract_student_data($);
}

export { get_student_data };