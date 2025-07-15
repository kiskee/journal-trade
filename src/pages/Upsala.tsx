import PDFSignatureComponent from "@/components/upsala/Signature";

export default function Upsala() {
    const handlePDFGenerated = (pdfData: Blob) => {
    console.log('PDF generado:', pdfData);
    // Aquí puedes enviar el PDF a tu backend
  };

  
    return (
        <>
        <h1>Upsala</h1>
       <PDFSignatureComponent 
        onPDFGenerated={handlePDFGenerated}
        //initialData={initialData}
        className="my-custom-class"
      />
      </>
    )
}