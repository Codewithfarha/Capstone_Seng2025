import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useLibrary } from '../context/LibraryContext';
import ComparisonTable from '../components/comparison/ComparisonTable';
import Loading from '../components/layout/Loading';
import { ArrowLeft, GitCompare, Package, AlertCircle, Star, Download, GitBranch, FileDown, CheckCircle, X } from 'lucide-react';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const ComparePage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { allLibraries, loading } = useLibrary();
  const [libraries, setLibraries] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false);
  const [exportSuccess, setExportSuccess] = useState(false);

  useEffect(() => {
    const libIds = searchParams.get('libs');
    if (!libIds) {
      setIsLoading(false);
      return;
    }

    const ids = libIds.split(',').map(id => id.trim());
    
    // Try to get libraries from sessionStorage first (for external libs)
    const storedLibs = sessionStorage.getItem('compareLibraries');
    if (storedLibs) {
      try {
        const parsedLibs = JSON.parse(storedLibs);
        const matchedLibs = ids
          .map(id => parsedLibs.find(lib => lib.id === id))
          .filter(Boolean);
        
        if (matchedLibs.length > 0) {
          console.log('✅ Loaded libraries from sessionStorage:', matchedLibs.map(l => l.name));
          setLibraries(matchedLibs);
          setIsLoading(false);
          return;
        }
      } catch (error) {
        console.error('Error parsing stored libraries:', error);
      }
    }

    // Fallback to context (for Firebase libs)
    if (allLibraries.length > 0) {
      const foundLibs = ids
        .map(id => allLibraries.find(lib => lib.id?.toString() === id))
        .filter(Boolean);
      
      console.log('✅ Loaded libraries from context:', foundLibs.map(l => l?.name || 'Unknown'));
      setLibraries(foundLibs);
    }
    
    setIsLoading(false);
  }, [searchParams, allLibraries]);

  // ✅ Helper function to safely get numeric value
  const getNumericValue = (value) => {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const parsed = parseInt(value.replace(/\D/g, ''));
      return isNaN(parsed) ? 0 : parsed;
    }
    return 0;
  };

  // ✅ Helper to format numbers
  const formatNumber = (num) => {
    const value = getNumericValue(num);
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(1)}K`;
    return value.toLocaleString();
  };

  // ✅ Safe comparison helpers
  const getHighestRated = () => {
    return libraries.reduce((prev, current) => {
      const prevRating = prev.rating || 0;
      const currentRating = current.rating || 0;
      return prevRating > currentRating ? prev : current;
    }, libraries[0]);
  };

  const getMostStars = () => {
    return libraries.reduce((prev, current) => {
      const prevStars = getNumericValue(prev.stars);
      const currentStars = getNumericValue(current.stars);
      return prevStars > currentStars ? prev : current;
    }, libraries[0]);
  };

  const getMostDownloads = () => {
    return libraries.reduce((prev, current) => {
      const prevDownloads = getNumericValue(prev.downloads);
      const currentDownloads = getNumericValue(current.downloads);
      return prevDownloads > currentDownloads ? prev : current;
    }, libraries[0]);
  };

  // 📄 PDF Export Function with Modal
  const handleExportClick = () => {
    setShowExportModal(true);
  };

  const confirmExport = () => {
    setIsExporting(true);
    exportToPDF();
  };

  const exportToPDF = () => {
    try {
      console.log('🔄 Starting PDF export...');
      console.log('📚 Libraries to export:', libraries.map(l => l.name));

      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;

      // Orange gradient colors for theme
      const primaryOrange = [234, 88, 12];
      const accentRose = [244, 63, 94];
      const lightOrange = [254, 215, 170];

      // Title
      doc.setFontSize(28);
      doc.setTextColor(...primaryOrange);
      doc.text('Library Comparison Report', pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 10;
      doc.setFontSize(10);
      doc.setTextColor(100);
      const dateStr = new Date().toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric' 
      });
      doc.text(`Generated on ${dateStr}`, pageWidth / 2, yPosition, { align: 'center' });
      
      yPosition += 15;

      // Library Summary Cards
      doc.setFontSize(16);
      doc.setTextColor(...primaryOrange);
      doc.text('Comparing Libraries:', 14, yPosition);
      yPosition += 10;

      libraries.forEach((lib, index) => {
        doc.setFillColor(...lightOrange);
        doc.rect(14, yPosition - 5, pageWidth - 28, 18, 'F');
        
        doc.setFontSize(12);
        doc.setFont(undefined, 'bold');
        doc.setTextColor(0);
        doc.text(`${index + 1}. ${lib.name || 'Unknown'}`, 20, yPosition);
        
        doc.setFont(undefined, 'normal');
        doc.setFontSize(9);
        doc.setTextColor(80);
        doc.text(`Category: ${lib.category || 'N/A'}`, 20, yPosition + 5);
        
        if (lib.rating) {
          doc.text(`Rating: ${lib.rating}/5.0 stars`, 20, yPosition + 10);
        }
        
        doc.setTextColor(0);
        yPosition += 22;
      });

      yPosition += 5;

      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Basic Information Table
      doc.setFontSize(16);
      doc.setTextColor(...primaryOrange);
      doc.text('Basic Information', 14, yPosition);
      yPosition += 5;

      const basicTableData = [
        ['Library Name', ...libraries.map(lib => lib.name || 'N/A')],
        ['Category', ...libraries.map(lib => lib.category || 'N/A')],
        ['Version', ...libraries.map(lib => lib.version || 'N/A')],
        ['License', ...libraries.map(lib => lib.license || 'Unknown')],
        ['Cost', ...libraries.map(lib => lib.cost || 'Free')],
      ];

      doc.autoTable({
        startY: yPosition,
        body: basicTableData,
        theme: 'grid',
        styles: { 
          fontSize: 9,
          cellPadding: 4,
          overflow: 'linebreak',
          lineWidth: 0.1
        },
        columnStyles: {
          0: { 
            fontStyle: 'bold', 
            fillColor: lightOrange,
            cellWidth: 40
          }
        },
        headStyles: {
          fillColor: primaryOrange,
          textColor: 255,
          fontStyle: 'bold',
          fontSize: 10
        },
        alternateRowStyles: {
          fillColor: [255, 250, 245]
        }
      });

      yPosition = doc.lastAutoTable.finalY + 12;

      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Performance Metrics Table
      doc.setFontSize(16);
      doc.setTextColor(...primaryOrange);
      doc.text('Performance Metrics', 14, yPosition);
      yPosition += 5;

      const metricsTableData = [
        ['Stars', ...libraries.map(lib => formatNumber(lib.stars) || 'N/A')],
        ['Downloads', ...libraries.map(lib => formatNumber(lib.downloads) || 'N/A')],
        ['Forks', ...libraries.map(lib => formatNumber(lib.forks) || 'N/A')],
        ['Rating', ...libraries.map(lib => lib.rating ? `${lib.rating}/5.0 stars` : 'N/A')],
        ['Source Rank', ...libraries.map(lib => lib.sourceRank || 'N/A')],
      ];

      doc.autoTable({
        startY: yPosition,
        body: metricsTableData,
        theme: 'grid',
        styles: { 
          fontSize: 9,
          cellPadding: 4,
          lineWidth: 0.1
        },
        columnStyles: {
          0: { 
            fontStyle: 'bold', 
            fillColor: lightOrange,
            cellWidth: 40
          }
        },
        alternateRowStyles: {
          fillColor: [255, 250, 245]
        }
      });

      yPosition = doc.lastAutoTable.finalY + 12;

      if (yPosition > pageHeight - 60) {
        doc.addPage();
        yPosition = 20;
      }

      // Platform Support Table
      doc.setFontSize(16);
      doc.setTextColor(...primaryOrange);
      doc.text('Platform Support', 14, yPosition);
      yPosition += 5;

      const platformTableData = [
        ['Windows', ...libraries.map(lib => {
          const hasWindows = lib.platforms?.includes('windows') || lib.platforms?.includes('Windows');
          return hasWindows ? 'Yes' : 'No';
        })],
        ['macOS', ...libraries.map(lib => {
          const hasMac = lib.platforms?.includes('macos') || lib.platforms?.includes('macOS');
          return hasMac ? 'Yes' : 'No';
        })],
        ['Linux', ...libraries.map(lib => {
          const hasLinux = lib.platforms?.includes('linux') || lib.platforms?.includes('Linux');
          return hasLinux ? 'Yes' : 'No';
        })],
      ];

      doc.autoTable({
        startY: yPosition,
        body: platformTableData,
        theme: 'grid',
        styles: { 
          fontSize: 9,
          cellPadding: 4,
          lineWidth: 0.1
        },
        columnStyles: {
          0: { 
            fontStyle: 'bold', 
            fillColor: lightOrange,
            cellWidth: 40
          }
        },
        alternateRowStyles: {
          fillColor: [255, 250, 245]
        }
      });

      yPosition = doc.lastAutoTable.finalY + 12;

      if (yPosition > pageHeight - 50) {
        doc.addPage();
        yPosition = 20;
      }

      // Quick Analysis Box
      doc.setFillColor(...accentRose);
      doc.roundedRect(14, yPosition - 5, pageWidth - 28, 40, 3, 3, 'F');

      const highestRated = getHighestRated();
      const mostStars = getMostStars();
      const mostDownloads = getMostDownloads();

      doc.setFontSize(14);
      doc.setTextColor(255);
      doc.text('Quick Analysis', 20, yPosition + 2);
      yPosition += 12;

      doc.setFontSize(10);
      doc.setFont(undefined, 'bold');
      doc.text('Highest Rated:', 20, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(`${highestRated.name} (${highestRated.rating || 'N/A'}/5.0 stars)`, 65, yPosition);
      yPosition += 8;

      doc.setFont(undefined, 'bold');
      doc.text('Most Stars:', 20, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(`${mostStars.name} (${formatNumber(mostStars.stars)} stars)`, 65, yPosition);
      yPosition += 8;

      doc.setFont(undefined, 'bold');
      doc.text('Most Downloads:', 20, yPosition);
      doc.setFont(undefined, 'normal');
      doc.text(`${mostDownloads.name} (${formatNumber(mostDownloads.downloads)} downloads)`, 65, yPosition);

      // Footer
      const pageCount = doc.internal.getNumberOfPages();
      doc.setFontSize(8);
      doc.setTextColor(150);
      for (let i = 1; i <= pageCount; i++) {
        doc.setPage(i);
        doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2, pageHeight - 10, { align: 'center' });
        doc.setFontSize(7);
        doc.text('Generated by Library Comparison Tool', pageWidth / 2, pageHeight - 5, { align: 'center' });
      }

      // Generate filename
      const libraryNames = libraries.map(l => l.name).join('-').substring(0, 50);
      const timestamp = Date.now();
      const fileName = `comparison-${libraryNames}-${timestamp}.pdf`;

      console.log('💾 Saving PDF as:', fileName);

      // Save the PDF
      doc.save(fileName);
      
      console.log('✅ PDF exported successfully!');
      
      // Show success state
      setExportSuccess(true);
      
      setTimeout(() => {
        setShowExportModal(false);
        setExportSuccess(false);
        setIsExporting(false);
      }, 2000);
      
    } catch (error) {
      console.error('❌ PDF Export Error:', error);
      alert(`Failed to export PDF: ${error.message}`);
      setIsExporting(false);
      setShowExportModal(false);
    }
  };

  if (loading || isLoading) return <Loading />;

  if (libraries.length < 2) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 flex items-center justify-center py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="bg-white rounded-2xl shadow-xl p-12 max-w-lg mx-auto border border-orange-200">
            <div className="bg-gradient-to-br from-orange-100 to-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="w-10 h-10 text-orange-600" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Not Enough Libraries</h2>
            <p className="text-gray-600 mb-8 text-lg">Please select at least 2 libraries to compare.</p>
            <Link 
              to="/search" 
              className="inline-flex items-center gap-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-8 py-4 rounded-lg hover:shadow-xl transition-all font-semibold"
            >
              <ArrowLeft className="w-5 h-5" />
              Go to Search
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const highestRated = getHighestRated();
  const mostStars = getMostStars();
  const mostDownloads = getMostDownloads();

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-orange-50 to-amber-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header with Back and Export buttons */}
        <div className="flex items-center justify-between mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-700 hover:text-gray-900 transition-colors font-medium bg-white px-4 py-2 rounded-lg shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>

          {/* Export to PDF Button */}
          <button
            onClick={handleExportClick}
            className="flex items-center gap-2 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white px-6 py-3 rounded-lg hover:shadow-xl transition-all font-semibold"
          >
            <FileDown className="w-5 h-5" />
            Export to PDF
          </button>
        </div>

        {/* Export Modal - Like Add to Favorites */}
        {showExportModal && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-fadeIn">
              {/* Close button */}
              <button
                onClick={() => {
                  setShowExportModal(false);
                  setExportSuccess(false);
                  setIsExporting(false);
                }}
                className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              {!exportSuccess ? (
                <>
                  {/* Icon */}
                  <div className="bg-gradient-to-r from-rose-100 via-orange-100 to-amber-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FileDown className="w-10 h-10 text-orange-600" />
                  </div>

                  {/* Title */}
                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                    Export to PDF?
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-center mb-6">
                    Download a professional comparison report of <span className="font-bold text-orange-600">{libraries.length} libraries</span>.
                  </p>

                  {/* Library list */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-6 max-h-40 overflow-y-auto">
                    {libraries.map((lib, index) => (
                      <div key={lib.id} className="flex items-center gap-2 py-2">
                        <Package className="w-4 h-4 text-orange-500" />
                        <span className="text-sm font-medium text-gray-700">{lib.name}</span>
                      </div>
                    ))}
                  </div>

                  {/* Buttons */}
                  <div className="flex gap-3">
                    <button
                      onClick={() => {
                        setShowExportModal(false);
                        setIsExporting(false);
                      }}
                      className="flex-1 px-6 py-3 border-2 border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-all font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={confirmExport}
                      disabled={isExporting}
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 text-white rounded-lg hover:shadow-lg transition-all font-semibold disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {isExporting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          Exporting...
                        </>
                      ) : (
                        <>
                          <FileDown className="w-5 h-5" />
                          Export PDF
                        </>
                      )}
                    </button>
                  </div>
                </>
              ) : (
                <>
                  {/* Success State */}
                  <div className="bg-gradient-to-r from-green-100 to-emerald-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-green-600" />
                  </div>

                  <h3 className="text-2xl font-bold text-gray-900 text-center mb-3">
                    PDF Exported Successfully!
                  </h3>

                  <p className="text-gray-600 text-center mb-6">
                    Your comparison report has been downloaded. Check your downloads folder.
                  </p>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-sm text-green-700 font-medium">
                      ✓ {libraries.length} libraries compared
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        )}

        {/* Title Section */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="bg-gradient-to-r from-rose-500 via-orange-500 to-amber-500 p-3 rounded-xl shadow-lg">
              <GitCompare className="w-10 h-10 text-white" />
            </div>
          </div>
          <h1 className="text-5xl font-bold text-gray-900 mb-3">
            Compare 
            <span className="bg-gradient-to-r from-rose-600 via-orange-600 to-amber-600 bg-clip-text text-transparent"> Libraries</span>
          </h1>
          <p className="text-xl text-gray-700">Side-by-side comparison of <span className="font-bold text-orange-600">{libraries.length}</span> libraries</p>
        </div>

        {/* Library Headers */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-6 border border-orange-200">
          <div className={`grid gap-4 p-6 bg-gradient-to-r from-rose-50 via-orange-50 to-amber-50 ${
            libraries.length === 2 ? 'grid-cols-3' : libraries.length === 3 ? 'grid-cols-4' : 'grid-cols-5'
          }`}>
            <div className="font-semibold text-gray-700"></div>
            {libraries.map((lib) => (
              <div key={lib.id} className="text-center">
                <div className="bg-white rounded-lg p-4 shadow-md border border-orange-200 hover:shadow-xl transition-all">
                  <div className="bg-gradient-to-br from-rose-500 via-orange-500 to-amber-500 p-3 rounded-lg inline-block mb-3 shadow-lg">
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{lib.name}</h3>
                  <p className="text-sm text-gray-600 mb-2 font-medium">{lib.category}</p>
                  {lib.source && lib.source !== 'firebase' && (
                    <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs font-bold rounded mb-2">
                      {lib.source.toUpperCase()}
                    </span>
                  )}
                  {lib.rating && (
                    <div className="text-amber-500 font-bold mt-2 flex items-center justify-center gap-1">
                      <Star className="w-4 h-4 fill-amber-500" />
                      {lib.rating}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Comparison Table */}
        <ComparisonTable libraries={libraries} />

        {/* Quick Analysis */}
        <div className="mt-8 bg-gradient-to-r from-amber-50 via-orange-50 to-rose-50 rounded-xl p-8 border-2 border-amber-300 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center gap-2">
            📊 Quick Analysis
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Highest Rated */}
            <div className="bg-white rounded-lg p-5 border border-rose-200 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                <p className="text-sm text-gray-600 font-medium">Highest Rated</p>
              </div>
              <p className="text-xl font-bold text-rose-600 mb-2">
                {highestRated.name}
              </p>
              <p className="text-sm text-gray-500">
                ⭐ {highestRated.rating || 'N/A'}/5.0
              </p>
            </div>

            {/* Most Stars */}
            <div className="bg-white rounded-lg p-5 border border-orange-200 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <GitBranch className="w-5 h-5 text-orange-500" />
                <p className="text-sm text-gray-600 font-medium">Most Stars</p>
              </div>
              <p className="text-xl font-bold text-orange-600 mb-2">
                {mostStars.name}
              </p>
              <p className="text-sm text-gray-500">
                ⭐ {formatNumber(mostStars.stars)} stars
              </p>
            </div>

            {/* Most Downloads */}
            <div className="bg-white rounded-lg p-5 border border-amber-200 shadow-md">
              <div className="flex items-center gap-2 mb-3">
                <Download className="w-5 h-5 text-amber-600" />
                <p className="text-sm text-gray-600 font-medium">Most Downloads</p>
              </div>
              <p className="text-xl font-bold text-amber-600 mb-2">
                {mostDownloads.name}
              </p>
              <p className="text-sm text-gray-500">
                ⬇️ {formatNumber(mostDownloads.downloads)} downloads
              </p>
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Cross-Platform Support */}
            <div className="bg-white rounded-lg p-4 border border-blue-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Cross-Platform Support</p>
              <div className="space-y-2">
                {libraries.map(lib => (
                  <div key={lib.id} className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">{lib.name}</span>
                    <span className="text-sm text-gray-600">
                      {lib.platforms?.length || 0}/3 platforms
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Source Rank */}
            <div className="bg-white rounded-lg p-4 border border-purple-200">
              <p className="text-sm text-gray-600 font-medium mb-2">Source Rank (Higher is Better)</p>
              <div className="space-y-2">
                {libraries
                  .sort((a, b) => (b.sourceRank || 0) - (a.sourceRank || 0))
                  .map(lib => (
                    <div key={lib.id} className="flex items-center justify-between">
                      <span className="text-sm font-medium text-gray-700">{lib.name}</span>
                      <span className="text-sm font-bold text-purple-600">
                        {lib.sourceRank || 'N/A'}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComparePage;