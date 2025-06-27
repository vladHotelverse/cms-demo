/**
 * Improved Addon Form Sheet component demonstrating new patterns and reusable components
 * This is an example of how the existing addon-form-sheet.tsx could be refactored
 */
"use client"

import React, { useState, useEffect, useCallback } from "react"

import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useToast } from "@/hooks/use-toast"

import { ADDON_CATEGORIES, SUPPORTED_LANGUAGES, getAddonCategoryOptions, getLanguageOptions } from "@/constants"
import { ErrorBoundary, MinimalErrorFallback } from "@/components/error-boundary"
import { FormField, FormSection, FormActions } from "@/components/forms"
import { validateAddonForm, type AddonFormData } from "@/lib/validations/addon"
import { useLanguage } from "@/contexts/language-context"
import type { Addon } from "@/types/addon"

interface AddonFormSheetProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  addon: Addon | null
  onSave: (addon: Addon) => void
  onDelete: (id: string) => void
}

/**
 * Improved Addon Form Sheet with better structure and reusable components
 */
const AddonFormSheetImproved: React.FC<AddonFormSheetProps> = ({
  open,
  onOpenChange,
  addon,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<AddonFormData>({
    name: "",
    description: "",
    type: "extra",
    categoryId: "",
    image: "",
    emails: [""],
    link: "",
    translations: {},
  })
  const [activeTab, setActiveTab] = useState("general")
  const [selectedLanguage, setSelectedLanguage] = useState("es")
  const [isLoading, setIsLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  
  const { toast } = useToast()
  const { t } = useLanguage()

  // Reset form when addon changes or sheet opens/closes
  useEffect(() => {
    if (open) {
      if (addon) {
        setFormData({
          ...addon,
          emails: addon.emails || [""],
        })
      } else {
        setFormData({
          name: "",
          description: "",
          type: "extra",
          categoryId: "",
          image: "",
          emails: [""],
          link: "",
          translations: {},
        })
      }
      setActiveTab("general")
      setErrors({})
    }
  }, [addon, open])

  /**
   * Handle form field changes with validation
   */
  const handleFieldChange = useCallback((field: keyof AddonFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Clear field error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }
  }, [errors])

  /**
   * Handle email list changes
   */
  const handleEmailChange = useCallback((index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails?.map((email, i) => i === index ? value : email) || []
    }))
  }, [])

  const handleAddEmail = useCallback(() => {
    setFormData(prev => ({
      ...prev,
      emails: [...(prev.emails || []), ""]
    }))
  }, [])

  const handleRemoveEmail = useCallback((index: number) => {
    setFormData(prev => ({
      ...prev,
      emails: prev.emails?.filter((_, i) => i !== index) || []
    }))
  }, [])

  /**
   * Handle translation changes
   */
  const handleTranslationChange = useCallback((language: string, field: 'name' | 'description', value: string) => {
    setFormData(prev => ({
      ...prev,
      translations: {
        ...prev.translations,
        [language]: {
          ...prev.translations?.[language],
          [field]: value
        }
      }
    }))
  }, [])

  /**
   * Validate form data
   */
  const validateForm = useCallback((): boolean => {
    const result = validateAddonForm(formData)
    
    if (!result.success) {
      const newErrors: Record<string, string> = {}
      result.error?.errors.forEach(error => {
        newErrors[error.path[0]] = error.message
      })
      setErrors(newErrors)
      return false
    }
    
    setErrors({})
    return true
  }, [formData])

  /**
   * Handle form submission
   */
  const handleSave = useCallback(async () => {
    if (!validateForm()) {
      toast({
        title: t('validationError'),
        description: t('fixErrorsBeforeSaving'),
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)
    
    try {
      const addonData: Addon = {
        ...formData,
        id: addon?.id || `addon-${Date.now()}`,
        createdAt: addon?.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      } as Addon

      await onSave(addonData)
      
      toast({
        title: t('success'),
        description: addon ? t('addonUpdatedSuccessfully') : t('addonCreatedSuccessfully')
      })
      
      onOpenChange(false)
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToSaveAddon'),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [formData, addon, validateForm, onSave, onOpenChange, toast])

  /**
   * Handle deletion
   */
  const handleDelete = useCallback(async () => {
    if (!addon?.id) return

    setIsLoading(true)
    
    try {
      await onDelete(addon.id)
      
      toast({
        title: t('success'),
        description: t('addonDeletedSuccessfully')
      })
      
      onOpenChange(false)
    } catch (error) {
      toast({
        title: t('error'),
        description: t('failedToDeleteAddon'),
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }, [addon, onDelete, onOpenChange, toast])

  const handleCancel = useCallback(() => {
    onOpenChange(false)
  }, [onOpenChange])

  return (
    <ErrorBoundary fallback={MinimalErrorFallback}>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent className="w-full sm:max-w-2xl">
          <SheetHeader>
            <SheetTitle>
              {addon ? t('editAddon') : t('createNewAddon')}
            </SheetTitle>
          </SheetHeader>

          <ScrollArea className="h-[calc(100vh-120px)] pr-4">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="mt-6">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="general">{t('general')}</TabsTrigger>
                <TabsTrigger value="translations">{t('translations')}</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6 mt-6">
                <FormSection
                  title={t('basicInformation')}
                  description={t('configureBasicAddonDetails')}
                >
                  <FormField
                    type="text"
                    name="name"
                    label={t('name')}
                    value={formData.name || ""}
                    onChange={(value) => handleFieldChange('name', value)}
                    error={errors.name}
                    required
                    placeholder={t('enterAddonName')}
                  />

                  <FormField
                    type="textarea"
                    name="description"
                    label={t('description')}
                    value={formData.description || ""}
                    onChange={(value) => handleFieldChange('description', value)}
                    error={errors.description}
                    placeholder={t('enterAddonDescription')}
                    rows={3}
                  />

                  <FormField
                    type="select"
                    name="type"
                    label={t('type')}
                    value={formData.type || "extra"}
                    onChange={(value) => handleFieldChange('type', value as 'extra' | 'experience')}
                    error={errors.type}
                    required
                    options={[
                      { value: "extra", label: "Extra" },
                      { value: "experience", label: "Experience" }
                    ]}
                  />

                  <FormField
                    type="select"
                    name="categoryId"
                    label={t('category')}
                    value={formData.categoryId || ""}
                    onChange={(value) => handleFieldChange('categoryId', value)}
                    error={errors.categoryId}
                    required
                    options={getAddonCategoryOptions()}
                    placeholder={t('selectACategory')}
                  />

                  <FormField
                    type="url"
                    name="image"
                    label={t('imageUrl')}
                    value={formData.image || ""}
                    onChange={(value) => handleFieldChange('image', value)}
                    error={errors.image}
                    placeholder="https://example.com/image.jpg"
                  />
                </FormSection>

                {formData.type === "extra" && (
                  <FormSection
                    title="Email Configuration"
                    description="Configure email addresses for this extra"
                  >
                    <div className="space-y-3">
                      {formData.emails?.map((email, index) => (
                        <div key={index} className="flex gap-2">
                          <FormField
                            type="email"
                            name={`email-${index}`}
                            label={index === 0 ? "Email Addresses" : ""}
                            value={email}
                            onChange={(value) => handleEmailChange(index, value)}
                            placeholder="Enter email address"
                            className="flex-1"
                          />
                          {formData.emails && formData.emails.length > 1 && (
                            <button
                              type="button"
                              onClick={() => handleRemoveEmail(index)}
                              className="mt-8 p-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          )}
                        </div>
                      ))}
                      <button
                        type="button"
                        onClick={handleAddEmail}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        + Add Email
                      </button>
                    </div>
                  </FormSection>
                )}

                {formData.type === "experience" && (
                  <FormSection
                    title="Experience Configuration"
                    description="Configure the experience link"
                  >
                    <FormField
                      type="url"
                      name="link"
                      label="Experience Link"
                      value={formData.link || ""}
                      onChange={(value) => handleFieldChange('link', value)}
                      error={errors.link}
                      placeholder="https://example.com/experience"
                    />
                  </FormSection>
                )}
              </TabsContent>

              <TabsContent value="translations" className="space-y-6 mt-6">
                <FormSection
                  title="Translations"
                  description="Add translations for different languages"
                >
                  <FormField
                    type="select"
                    name="selectedLanguage"
                    label="Select Language"
                    value={selectedLanguage}
                    onChange={setSelectedLanguage}
                    options={getLanguageOptions()}
                  />

                  <div className="space-y-4 p-4 border rounded-lg">
                    <h4 className="font-medium">
                      {SUPPORTED_LANGUAGES.find(lang => lang.id === selectedLanguage)?.name} Translation
                    </h4>
                    
                    <FormField
                      type="text"
                      name={`translation-name-${selectedLanguage}`}
                      label="Translated Name"
                      value={formData.translations?.[selectedLanguage]?.name || ""}
                      onChange={(value) => handleTranslationChange(selectedLanguage, 'name', value)}
                      placeholder="Enter translated name"
                    />

                    <FormField
                      type="textarea"
                      name={`translation-description-${selectedLanguage}`}
                      label="Translated Description"
                      value={formData.translations?.[selectedLanguage]?.description || ""}
                      onChange={(value) => handleTranslationChange(selectedLanguage, 'description', value)}
                      placeholder="Enter translated description"
                      rows={3}
                    />
                  </div>
                </FormSection>
              </TabsContent>
            </Tabs>
          </ScrollArea>

          <div className="mt-6 pt-4 border-t">
            <FormActions
              onSave={handleSave}
              onCancel={handleCancel}
              onDelete={addon ? handleDelete : undefined}
              showDelete={!!addon}
              isLoading={isLoading}
              saveLabel={addon ? "Update Addon" : "Create Addon"}
              deleteLabel="Delete Addon"
            />
          </div>
        </SheetContent>
      </Sheet>
    </ErrorBoundary>
  )
}

export default React.memo(AddonFormSheetImproved)
