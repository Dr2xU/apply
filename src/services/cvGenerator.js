import { PDFDocument, rgb, StandardFonts } from 'pdf-lib'
import * as docx from 'docx-parser'

/**
 * Extract data from the CV file
 * @param {File} file - The CV file
 * @returns {Promise<Object>} - Extracted CV data
 */
export async function extractCvData(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()

    reader.onload = async (e) => {
      try {
        const content = e.target.result
        let extractedData = {}

        if (file.name.endsWith('.pdf')) {
          extractedData = await extractFromPdf(content)
        } else if (file.name.endsWith('.docx') || file.name.endsWith('.doc')) {
          extractedData = await extractFromDocx(content)
        } else {
          throw new Error('Unsupported file format')
        }

        resolve(extractedData)
      } catch (error) {
        reject(error)
      }
    }

    reader.onerror = () => {
      reject(new Error('Failed to read file'))
    }

    if (file.name.endsWith('.pdf')) {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsBinaryString(file)
    }
  })
}

/**
 * Extract text from PDF file
 * @param {ArrayBuffer} content - PDF file content
 * @returns {Promise<Object>} - Extracted data
 */
async function extractFromPdf(content) {
  try {
    // For simplicity we're using a mock implementation
    // In a real application, you would use a PDF parsing library
    console.log('Extracting from PDF', content.byteLength)

    // Simulate extraction with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock data
    return getMockCvData()
  } catch (error) {
    console.error('PDF extraction error:', error)
    throw new Error('Failed to extract data from PDF')
  }
}

/**
 * Extract text from DOCX file
 * @param {string} content - DOCX file content
 * @returns {Promise<Object>} - Extracted data
 */
async function extractFromDocx(content) {
  try {
    // For simplicity we're using a mock implementation
    // In a real application, you would use a DOCX parsing library
    console.log('Extracting from DOCX', content.length)

    // Simulate extraction with timeout
    await new Promise((resolve) => setTimeout(resolve, 1000))

    // Return mock data
    return getMockCvData()
  } catch (error) {
    console.error('DOCX extraction error:', error)
    throw new Error('Failed to extract data from DOCX')
  }
}

/**
 * Generate mock CV data
 * @returns {Object} - Mock CV data
 */
function getMockCvData() {
  return {
    name: 'John Doe',
    contact: {
      email: 'john.doe@example.com',
      phone: '(123) 456-7890',
      address: 'New York, NY',
      linkedin: 'linkedin.com/in/johndoe',
    },
    summary:
      'Software developer with 5 years of experience specializing in web development and UI/UX design.',
    skills: [
      'JavaScript',
      'Vue.js',
      'React',
      'Node.js',
      'HTML5',
      'CSS3',
      'Git',
      'RESTful APIs',
      'MongoDB',
      'PostgreSQL',
    ],
    experience: [
      {
        title: 'Senior Frontend Developer',
        company: 'Tech Solutions Inc.',
        location: 'New York, NY',
        period: 'Jan 2021 - Present',
        description:
          'Developed and maintained multiple web applications using Vue.js and React. Implemented responsive designs and improved application performance.',
      },
      {
        title: 'Web Developer',
        company: 'Digital Creations',
        location: 'Boston, MA',
        period: 'Jun 2018 - Dec 2020',
        description:
          'Built RESTful APIs using Node.js. Created frontend interfaces with Vue.js and integrated with backend services.',
      },
    ],
    education: [
      {
        degree: 'Bachelor of Science in Computer Science',
        institution: 'Boston University',
        location: 'Boston, MA',
        year: '2018',
      },
    ],
  }
}

/**
 * Generate a tailored CV based on job requirements
 * @param {Object} cvData - Extracted CV data
 * @param {Object} job - Job data
 * @returns {Promise<ArrayBuffer>} - Generated PDF as ArrayBuffer
 */
export async function generateTailoredCv(cvData, job) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size

    // Get the font
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold)

    // Define text options
    const titleSize = 18
    const headingSize = 14
    const normalSize = 10
    const smallSize = 9

    let yPosition = 800 // Starting y position
    const margin = 50

    // Add name
    page.drawText(cvData.name, {
      x: margin,
      y: yPosition,
      size: titleSize,
      font: boldFont,
      color: rgb(0, 0.3, 0.6),
    })

    yPosition -= 25

    // Add contact information
    const contactText = `${cvData.contact.email} | ${cvData.contact.phone} | ${cvData.contact.address}`
    page.drawText(contactText, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font,
    })

    yPosition -= 30

    // Add tailored summary - highlight relevant skills matching job tags
    page.drawText('Professional Summary', {
      x: margin,
      y: yPosition,
      size: headingSize,
      font: boldFont,
      color: rgb(0, 0.3, 0.6),
    })

    yPosition -= 20

    // Create tailored summary
    const jobTags = job.tags || []
    let tailoredSummary = cvData.summary

    // Add tailored note
    tailoredSummary += ` Particularly skilled in ${jobTags.slice(0, 3).join(', ')}, which are directly applicable to the ${job.title} role at ${job.company_name}.`

    // Split summary into lines
    const summaryLines = splitTextIntoLines(tailoredSummary, 80)

    summaryLines.forEach((line) => {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: normalSize,
        font,
      })
      yPosition -= 15
    })

    yPosition -= 10

    // Add skills section - prioritizing skills that match job tags
    page.drawText('Skills', {
      x: margin,
      y: yPosition,
      size: headingSize,
      font: boldFont,
      color: rgb(0, 0.3, 0.6),
    })

    yPosition -= 20

    // Sort skills based on job tags
    const sortedSkills = [...cvData.skills].sort((a, b) => {
      const aInTags = jobTags.some((tag) => tag.toLowerCase().includes(a.toLowerCase()))
      const bInTags = jobTags.some((tag) => tag.toLowerCase().includes(b.toLowerCase()))

      if (aInTags && !bInTags) return -1
      if (!aInTags && bInTags) return 1
      return 0
    })

    // Create skill lines with highlighted matching skills
    const skillLines = []
    let currentLine = ''

    sortedSkills.forEach((skill) => {
      if ((currentLine + skill).length > 70) {
        skillLines.push(currentLine)
        currentLine = skill
      } else {
        currentLine += currentLine ? ` • ${skill}` : skill
      }
    })

    if (currentLine) skillLines.push(currentLine)

    skillLines.forEach((line) => {
      page.drawText(line, {
        x: margin,
        y: yPosition,
        size: normalSize,
        font,
      })
      yPosition -= 15
    })

    yPosition -= 10

    // Add experience section
    page.drawText('Professional Experience', {
      x: margin,
      y: yPosition,
      size: headingSize,
      font: boldFont,
      color: rgb(0, 0.3, 0.6),
    })

    yPosition -= 20

    // Add experiences
    cvData.experience.forEach((exp) => {
      page.drawText(`${exp.title}`, {
        x: margin,
        y: yPosition,
        size: normalSize,
        font: boldFont,
      })

      yPosition -= 15

      page.drawText(`${exp.company}, ${exp.location} | ${exp.period}`, {
        x: margin,
        y: yPosition,
        size: smallSize,
        font,
      })

      yPosition -= 15

      // Split description into lines
      const descLines = splitTextIntoLines(exp.description, 80)

      descLines.forEach((line) => {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: normalSize,
          font,
        })
        yPosition -= 15
      })

      yPosition -= 10
    })

    // Add education section
    page.drawText('Education', {
      x: margin,
      y: yPosition,
      size: headingSize,
      font: boldFont,
      color: rgb(0, 0.3, 0.6),
    })

    yPosition -= 20

    // Add education
    cvData.education.forEach((edu) => {
      page.drawText(`${edu.degree}`, {
        x: margin,
        y: yPosition,
        size: normalSize,
        font: boldFont,
      })

      yPosition -= 15

      page.drawText(`${edu.institution}, ${edu.location} | ${edu.year}`, {
        x: margin,
        y: yPosition,
        size: smallSize,
        font,
      })

      yPosition -= 20
    })

    // Add tailored for note at bottom
    page.drawText(`Tailored for: ${job.title} at ${job.company_name}`, {
      x: margin,
      y: 50,
      size: smallSize,
      font: boldFont,
      color: rgb(0, 0.3, 0.6),
    })

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.error('Error generating CV:', error)
    throw new Error('Failed to generate CV')
  }
}

/**
 * Generate a cover letter based on the job requirements
 * @param {Object} cvData - Extracted CV data
 * @param {Object} job - Job data
 * @returns {Promise<ArrayBuffer>} - Generated PDF as ArrayBuffer
 */
export async function generateCoverLetter(cvData, job) {
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create()
    const page = pdfDoc.addPage([595.28, 841.89]) // A4 size

    // Get the font
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman)
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold)

    // Define text options
    const normalSize = 11
    const smallSize = 10

    let yPosition = 750 // Starting y position
    const margin = 60
    const rightMargin = 450

    // Current date
    const today = new Date()
    const dateString = today.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })

    page.drawText(dateString, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font,
    })

    yPosition -= 30

    // Recipient info
    page.drawText(`Hiring Manager`, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font,
    })

    yPosition -= 15

    page.drawText(`${job.company_name}`, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font,
    })

    yPosition -= 30

    // Subject line
    page.drawText(`Re: Application for ${job.title} Position`, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font: boldFont,
    })

    yPosition -= 30

    // Salutation
    page.drawText(`Dear Hiring Manager,`, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font,
    })

    yPosition -= 25

    // Generate tailored cover letter content
    const jobTags = job.tags || []
    const relevantSkills = cvData.skills
      .filter((skill) => jobTags.some((tag) => tag.toLowerCase().includes(skill.toLowerCase())))
      .slice(0, 3)
      .join(', ')

    // Generate paragraphs
    const paragraphs = [
      `I am writing to express my interest in the ${job.title} position at ${job.company_name}. With my background in ${cvData.experience[0].title} and skills in ${relevantSkills}, I am confident that I would be a valuable addition to your team.`,

      `Throughout my career at ${cvData.experience[0].company} and ${cvData.experience.length > 1 ? cvData.experience[1].company : 'other organizations'}, I have developed expertise in ${jobTags.slice(0, 3).join(', ')}, which align perfectly with the requirements outlined in your job description. My experience has equipped me with a deep understanding of ${job.job_type.replace('_', ' ')} development practices and methodologies.`,

      `What particularly draws me to ${job.company_name} is the opportunity to work on innovative solutions and contribute to projects that make a real impact. I am impressed by your company's reputation in the industry and am excited about the possibility of bringing my skills and experience to your team.`,

      `I would welcome the opportunity to discuss how my qualifications align with your needs for the ${job.title} role. Thank you for considering my application. I look forward to the possibility of working with the talented team at ${job.company_name}.`,
    ]

    // Add paragraphs
    paragraphs.forEach((paragraph) => {
      const lines = splitTextIntoLines(paragraph, 75)

      lines.forEach((line) => {
        page.drawText(line, {
          x: margin,
          y: yPosition,
          size: normalSize,
          font,
        })
        yPosition -= 15
      })

      yPosition -= 15
    })

    // Add closing
    page.drawText('Sincerely,', {
      x: margin,
      y: yPosition,
      size: normalSize,
      font,
    })

    yPosition -= 40

    page.drawText(cvData.name, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font: boldFont,
    })

    yPosition -= 15

    page.drawText(cvData.contact.email, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font,
    })

    yPosition -= 15

    page.drawText(cvData.contact.phone, {
      x: margin,
      y: yPosition,
      size: normalSize,
      font,
    })

    // Serialize the PDF
    const pdfBytes = await pdfDoc.save()
    return pdfBytes
  } catch (error) {
    console.error('Error generating cover letter:', error)
    throw new Error('Failed to generate cover letter')
  }
}

/**
 * Split text into lines based on maximum width
 * @param {string} text - Text to split
 * @param {number} maxChars - Maximum characters per line
 * @returns {string[]} - Array of lines
 */
function splitTextIntoLines(text, maxChars) {
  const words = text.split(' ')
  const lines = []
  let currentLine = ''

  words.forEach((word) => {
    if ((currentLine + ' ' + word).length <= maxChars) {
      currentLine += (currentLine ? ' ' : '') + word
    } else {
      lines.push(currentLine)
      currentLine = word
    }
  })

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines
}
