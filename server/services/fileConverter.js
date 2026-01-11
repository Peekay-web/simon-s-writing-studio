const mammoth = require('mammoth');
const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');

class FileConverter {
  
  // Convert Word document to HTML
  static async convertWordToHtml(filePath) {
    try {
      const result = await mammoth.convertToHtml({ path: filePath });
      return {
        html: result.value,
        messages: result.messages
      };
    } catch (error) {
      throw new Error(`Word conversion failed: ${error.message}`);
    }
  }

  // Convert Excel to JSON data
  static async convertExcelToJson(filePath) {
    try {
      const workbook = XLSX.readFile(filePath);
      const sheets = {};
      
      workbook.SheetNames.forEach(sheetName => {
        const worksheet = workbook.Sheets[sheetName];
        sheets[sheetName] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      });
      
      return {
        sheets,
        sheetNames: workbook.SheetNames
      };
    } catch (error) {
      throw new Error(`Excel conversion failed: ${error.message}`);
    }
  }

  // Convert PowerPoint to images (requires LibreOffice)
  static async convertPowerPointToImages(filePath) {
    try {
      const libre = require('libreoffice-convert');
      const inputBuffer = await fs.readFile(filePath);
      
      // Convert to PDF first
      const pdfBuffer = await new Promise((resolve, reject) => {
        libre.convert(inputBuffer, '.pdf', undefined, (err, done) => {
          if (err) reject(err);
          else resolve(done);
        });
      });

      // Save PDF temporarily
      const tempPdfPath = filePath.replace(path.extname(filePath), '_temp.pdf');
      await fs.writeFile(tempPdfPath, pdfBuffer);

      // Convert PDF to images using pdf-poppler
      const pdf2pic = require('pdf-poppler');
      const options = {
        format: 'jpeg',
        out_dir: path.dirname(filePath),
        out_prefix: path.basename(filePath, path.extname(filePath)),
        page: null // Convert all pages
      };

      const slides = await pdf2pic.convert(tempPdfPath, options);
      
      // Clean up temp PDF
      await fs.unlink(tempPdfPath);
      
      return slides;
    } catch (error) {
      throw new Error(`PowerPoint conversion failed: ${error.message}`);
    }
  }

  // Get file type and appropriate converter
  static getFileType(filename) {
    const ext = path.extname(filename).toLowerCase();
    
    switch (ext) {
      case '.doc':
      case '.docx':
        return 'word';
      case '.xls':
      case '.xlsx':
        return 'excel';
      case '.ppt':
      case '.pptx':
        return 'powerpoint';
      case '.pdf':
        return 'pdf';
      default:
        return 'unknown';
    }
  }

  // Main conversion method
  static async convertFile(filePath) {
    const fileType = this.getFileType(filePath);
    
    switch (fileType) {
      case 'word':
        return {
          type: 'word',
          data: await this.convertWordToHtml(filePath)
        };
      
      case 'excel':
        return {
          type: 'excel',
          data: await this.convertExcelToJson(filePath)
        };
      
      case 'powerpoint':
        return {
          type: 'powerpoint',
          data: await this.convertPowerPointToImages(filePath)
        };
      
      case 'pdf':
        return {
          type: 'pdf',
          data: { message: 'PDF files are served directly' }
        };
      
      default:
        throw new Error('Unsupported file type');
    }
  }
}

module.exports = FileConverter;