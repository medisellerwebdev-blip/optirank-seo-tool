/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom"
import { Layout } from "./components/layout/Layout"
import { Dashboard } from "./pages/Dashboard"
import { ContentGenerator } from "./pages/ContentGenerator"
import { KeywordResearch } from "./pages/KeywordResearch"
import { TechnicalSEO } from "./pages/TechnicalSEO"
import { MediaSEO } from "./pages/MediaSEO"
import { BacklinkFinder } from "./pages/BacklinkFinder"

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="content-generator" element={<ContentGenerator />} />
          <Route path="keyword-research" element={<KeywordResearch />} />
          <Route path="technical-seo" element={<TechnicalSEO />} />
          <Route path="media-seo" element={<MediaSEO />} />
          <Route path="backlink-finder" element={<BacklinkFinder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
