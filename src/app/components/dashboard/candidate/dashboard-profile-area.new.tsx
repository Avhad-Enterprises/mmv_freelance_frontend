// [Previous content unchanged...]

            {(profileData.rate_amount || isEditModeFor("rates")) && (
              <InfoSection title="Services & Rates" sectionKey="rates" editingSection={editingSection} onEdit={handleEdit} onSave={handleSave} onCancel={handleCancel} isSaving={saving}>
                <div className="row mb-3">
                  <div className="col-md-4"><strong>Hourly Rate:</strong></div>
                  <div className="col-md-8">
                    {isEditModeFor("rates") ? (
                      <div className="input-group">
                        <span className="input-group-text">₹</span>
                        <input 
                          type="number" 
                          className="form-control" 
                          value={editedData.rate_amount || ''} 
                          onChange={(e) => handleInputChange('rate_amount', parseFloat(e.target.value) || 0)} 
                        />
                        <span className="input-group-text">/hr</span>
                      </div>
                    ) : (
                      <span style={{ fontSize: '18px', fontWeight: 'bold', color: '#244034' }}>
                        ₹ {displayData.rate_amount}/hr
                      </span>
                    )}
                  </div>
                </div>
              </InfoSection>
            )}

// [Rest of the content unchanged...]