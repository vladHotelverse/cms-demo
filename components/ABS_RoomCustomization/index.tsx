import clsx from 'clsx'
import type React from 'react'
import { useState } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog'
import { CustomizationSection } from './components/CustomizationSection'
import { ConflictResolutionDialog } from './components/ConflictResolutionDialog'
import { useCustomizationState } from './hooks/useCustomizationState'
import type { RoomCustomizationProps } from './types'

const RoomCustomization: React.FC<RoomCustomizationProps> = ({
  className,
  id,
  sections,
  sectionOptions,
  initialSelections,
  onCustomizationChange,
  texts,
  fallbackImageUrl,
  compatibilityRules,
  mode = 'interactive',
  readonly = false,
}) => {
  const { 
    selectedOptions, 
    openSections, 
    disabledOptions,
    pendingConflict,
    toggleSection, 
    handleSelect,
    resolveConflict,
    dismissConflict,
  } = useCustomizationState({
    initialSelections,
    sectionOptions,
    onCustomizationChange,
    compatibilityRules,
  })

  const [modalSection, setModalSection] = useState<string | null>(null)

  const handleOpenModal = (sectionKey: string) => {
    setModalSection(sectionKey)
  }

  const handleCloseModal = () => {
    setModalSection(null)
  }

  const currentModalSection = sections.find((section) => section.key === modalSection)

  // Filter sections in consultation mode to only show those with selections
  const sectionsToShow = mode === 'consultation' 
    ? sections.filter(section => selectedOptions[section.key])
    : sections

  return (
    <>
      <div id={id} data-testid={id} className={clsx('section rounded-lg mt-6', className)}>
        <div className="rounded-lg">
          {sectionsToShow.map((section) => {
            const options = sectionOptions[section.key] || []
            return (
              <CustomizationSection
                key={section.key}
                config={section}
                options={options}
                selectedOptions={selectedOptions}
                disabledOptions={disabledOptions}
                isOpen={openSections[section.key] || false}
                onToggle={() => toggleSection(section.key)}
                onSelect={(optionId) => handleSelect(section.key, optionId)}
                onOpenModal={section.hasModal ? () => handleOpenModal(section.key) : undefined}
                texts={texts}
                fallbackImageUrl={fallbackImageUrl}
                mode={mode}
                readonly={readonly}
              />
            )
          })}
        </div>
      </div>

      {/* Features Dialog */}
      <Dialog open={!!modalSection} onOpenChange={(open) => !open && handleCloseModal()}>
        <DialogContent className="max-w-2xl">
          {currentModalSection && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center">
                  {currentModalSection.icon && <currentModalSection.icon className="w-6 h-6 mr-3" />}
                  {currentModalSection.title}
                </DialogTitle>
                {currentModalSection.infoText && (
                  <DialogDescription className="text-left">
                    <strong className="block mb-2">{texts.featuresText}</strong>
                    {currentModalSection.infoText}
                  </DialogDescription>
                )}
              </DialogHeader>

              {currentModalSection.hasFeatures && modalSection && (
                <div className="my-4">
                  <h4 className="text-md font-medium mb-3">{texts.availableOptionsText}</h4>
                  <div className="space-y-2">
                    {sectionOptions[modalSection]?.map((option) => (
                      <div key={option.id} className="flex justify-between items-center p-3 bg-neutral-100 rounded-lg">
                        <div>
                          <span className="font-medium">{'label' in option ? option.label : option.name}</span>
                          {option.description && <p className="text-sm text-neutral-600">{option.description}</p>}
                        </div>
                        <span className="text-sm font-semibold">
                          {option.price.toFixed(2)} {texts.pricePerNightText}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <DialogFooter>
                <button
                  onClick={handleCloseModal}
                  className="px-4 py-2 bg-neutral-900 text-white rounded-lg hover:bg-neutral-800 transition-colors"
                >
                  {texts.understood}
                </button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Conflict Resolution Dialog */}
      <ConflictResolutionDialog
        conflict={pendingConflict}
        texts={texts}
        onResolve={resolveConflict}
        onDismiss={dismissConflict}
      />
    </>
  )
}

export default RoomCustomization
export { RoomCustomization as ABS_RoomCustomization }
