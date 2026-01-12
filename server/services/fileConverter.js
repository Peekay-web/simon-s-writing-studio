const mammoth = require('mammoth');
const XLSX = require('xlsx');
const fs = require('fs').promises;
const path = require('path');
const { exec } = require('child_process');
const util = require('util');
const axios = require('axios');
const execPromise = util.promisify(exec);

class FileConverter {

  static async ensureDir(dir) {
    try {
      await fs.mkdir(dir, { recursive: true });
    } catch (err) {
      if (err.code !== 'EEXIST') throw err;
    }
  }

  // Helper to download file from URL to temp location
  static async downloadFromUrl(url) {
    try {
      const tempDir = path.join('uploads', 'temp');
      await this.ensureDir(tempDir);

      const fileName = `temp_${Date.now()}_${path.basename(new URL(url).pathname)}`;
      const filePath = path.join(tempDir, fileName);

      const response = await axios({
        url,
        method: 'GET',
        responseType: 'arraybuffer'
      });

      await fs.writeFile(filePath, response.data);
      return filePath;
    } catch (error) {
      console.error('Error downloading file for conversion:', error);
      throw new Error(`Failed to download file: ${error.message}`);
    }
  }

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

  // Convert PDF to images
  static async convertPdfToImages(filePath) {
    try {
      const pdf2pic = require('pdf-poppler');
      const outputDir = path.join('uploads', 'converted', path.basename(filePath, path.extname(filePath)));
      await this.ensureDir(outputDir);

      const options = {
        format: 'jpeg',
        out_dir: outputDir,
        out_prefix: 'page',
        page: null // Convert all pages
      };

      await pdf2pic.convert(filePath, options);

      // Get list of generated images
      const files = await fs.readdir(outputDir);
      const images = files
        .filter(f => f.endsWith('.jpg') || f.endsWith('.jpeg'))
        .sort((a, b) => {
          const numA = parseInt(a.match(/\d+/)?.[0] || '0');
          const numB = parseInt(b.match(/\d+/)?.[0] || '0');
          return numA - numB;
        })
        .map(f => `uploads/converted/${path.basename(outputDir)}/${f}`);

      return images;
    } catch (error) {
      console.error('PDF to Image conversion error:', error);
      throw new Error(`PDF conversion failed: ${error.message}`);
    }
  }

  // Convert PowerPoint to images (requires LibreOffice)
  static async convertPowerPointToImages(filePath) {
    try {
      const libre = require('libreoffice-convert');
      const libreConvert = util.promisify(libre.convert);
      const inputBuffer = await fs.readFile(filePath);

      // Convert to PDF first
      const pdfBuffer = await libreConvert(inputBuffer, '.pdf', undefined);

      // Save PDF temporarily
      const tempPdfPath = filePath.replace(path.extname(filePath), '_temp.pdf');
      await fs.writeFile(tempPdfPath, pdfBuffer);

      // Convert PDF to images
      try {
        const images = await this.convertPdfToImages(tempPdfPath);
        return images;
      } finally {
        // Clean up temp PDF
        try {
          await fs.unlink(tempPdfPath);
        } catch (e) { }
      }
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
  static async convertFile(inputPath) {
    let filePath = inputPath;
    let isTemp = false;

    // If input is a URL, download it first
    if (inputPath.startsWith('http')) {
      filePath = await this.downloadFromUrl(inputPath);
      isTemp = true;
    }

    try {
      const fileType = this.getFileType(filePath);

      let result;
      switch (fileType) {
        case 'word':
          result = {
            type: 'word',
            data: await this.convertWordToHtml(filePath)
          };
          break;

        case 'excel':
          result = {
            type: 'excel',
            data: await this.convertExcelToJson(filePath)
          };
          break;

        case 'powerpoint':
          result = {
            type: 'powerpoint',
            data: await this.convertPowerPointToImages(filePath)
          };
          break;

        case 'pdf':
          result = {
            type: 'pdf',
            data: await this.convertPdfToImages(filePath)
          };
          break;

        default:
          throw new Error('Unsupported file type');
      }
      return result;
    } finally {
      // Clean up temp file if we downloaded it
      if (isTemp) {
        try {
          await fs.unlink(filePath);
        } catch (e) {
          console.error('Error cleaning up temp file:', e.message);
        }
      }
    }
  }
}

module.exports = FileConverter;