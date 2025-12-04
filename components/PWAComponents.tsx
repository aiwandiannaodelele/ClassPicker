'use client'

import { useState, useEffect } from 'react'
import { useLanguage } from '@/contexts/LanguageContext'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function PWAFeatures() {
  const { t } = useLanguage()
  const [isIOS, setIsIOS] = useState(false)
  const [isStandalone, setIsStandalone] = useState(false)

  useEffect(() => {
    setIsIOS(
      /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream
    )

    setIsStandalone(window.matchMedia('(display-mode: standalone)').matches)
  }, [])

  if (isStandalone) {
    return null // Don't show install button if already installed
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">安装应用</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button className="w-full">添加到主屏幕</Button>
        {isIOS && (
          <p className="text-xs text-muted-foreground">
            要在iOS设备上安装此应用，请点击分享按钮
            <span role="img" aria-label="share icon">
              {' '}⎋{' '}
            </span>
            然后选择"添加到主屏幕"
            <span role="img" aria-label="plus icon">
              {' '}➕{' '}
            </span>
            。
          </p>
        )}
      </CardContent>
    </Card>
  )
}