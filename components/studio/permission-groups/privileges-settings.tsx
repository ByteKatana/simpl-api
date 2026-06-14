"use client"
import { Item, ItemActions, ItemContent, ItemTitle } from "@/components/ui/item"
import { Button } from "@/components/ui/button"
import { ArrowBigRightDash, Pencil, RefreshCcw, Trash2, TriangleAlert } from "lucide-react"
import { Field, FieldContent, FieldDescription, FieldLabel, FieldTitle } from "@/components/ui/field"
import { EyeOpenIcon } from "@radix-ui/react-icons"
import { Switch } from "@/components/ui/switch"
import FormSubmitResetBtn from "@/components/studio/form-submit-reset-btn"
import { ReactFormExtendedApi, useStore } from "@tanstack/react-form"
import { FormMode } from "@/interfaces"
import { PermissionGroup } from "@/interfaces/permission_group"
import { useState, useMemo, useEffect } from "react"
import { SYSTEM_FEATURES } from "@/lib/schemas/constants"
import { EntryType } from "@/interfaces/entry_type"

type Props = {
  form: ReactFormExtendedApi<any, any, any, any, any, any, any, any, any, any, any, any>
  mode: FormMode
  namespaces: EntryType[]
  permGroups?: PermissionGroup[]
}

const PrivilegesSettings = ({ form, mode, namespaces, permGroups }: Props) => {
  const [selected, setSelected] = useState({
    permission_group_sys:
      form.state.values.name?.split(" ").join("-") || (permGroups && permGroups.length > 0 ? permGroups[0].slug : ""),
    permission_group_ns:
      form.state.values.name?.split(" ").join("-") || (permGroups && permGroups.length > 0 ? permGroups[0].slug : ""),
    feature: "Entry Types",
    namespace: namespaces && namespaces.length > 0 ? namespaces[0].namespace : ""
  })

  //Watch changes of Permission group name and update selected values
  const permGroupName = useStore(form.store, (state) => state.values.name?.split(" ").join("-"))

  const nsEnabled = useStore(form.store, (state) => {
    const pg = selected.permission_group_ns
    if (!pg) return false
    const entryTypesRead = getNestedValue(state.values, `privileges.${pg}.system.entry_types.list`)
    const entriesRead = getNestedValue(state.values, `privileges.${pg}.system.entries.list`)
    return !!entryTypesRead && !!entriesRead
  })

  useEffect(() => {
    if (permGroupName) {
      const oldKeySys = selected.permission_group_sys

      //Rename the key in form values if old key exists and differs from new key
      if (oldKeySys && oldKeySys !== permGroupName) {
        const currVals = form.state.values.privileges?.[oldKeySys]
        if (currVals) {
          form.setFieldValue(`privileges.${permGroupName}`, currVals)
          form.deleteField(`privileges.${oldKeySys}`)
        }
      }

      if (permGroupName) {
        setSelected({
          ...selected,
          permission_group_sys: permGroupName,
          permission_group_ns: permGroupName
        })
      }
    }
  }, [permGroupName])

  useEffect(() => {
    if (!nsEnabled) {
      const pg = selected.permission_group_ns
      if (!pg) return
      const namespacesObj = form.state.values.privileges?.[pg]?.namespaces
      if (!namespacesObj) return

      Object.keys(namespacesObj).forEach((nsKey) => {
        const actions = namespacesObj[nsKey]
        if (!actions) return
        Object.keys(actions).forEach((action) => {
          if (actions[action] === true) {
            form.setFieldValue(`privileges.${pg}.namespaces.${nsKey}.${action}`, false)
          }
        })
      })
    }
  }, [nsEnabled])

  const showPermGroups = mode !== FormMode.CREATE && !form.state.values.name

  // Build field name prefix for system privileges
  const sysFieldPrefix = useMemo(() => {
    const pg = selected.permission_group_sys
    if (!pg || !selected.feature) return null
    const featureKey = selected.feature.toLowerCase().replace(/\s+/g, "_")
    return `privileges.${pg}.system.${featureKey}`
  }, [selected.permission_group_sys, selected.feature])

  // Build field name prefix for namespace privileges
  const nsFieldPrefix = useMemo(() => {
    const pg = selected.permission_group_ns
    if (!pg || !selected.namespace) return null
    return `privileges.${pg}.namespaces.${selected.namespace.split(".").join("_DOT_")}`
  }, [selected.permission_group_ns, selected.namespace])

  return (
    <div className="flex flex-col gap-y-5 gap-x-5 w-280">
      {/* ===== System Permissions ===== */}
      <div id="entry_perm_title" className="flex flex-col gap-y-1">
        <h4 className="text-xl font-medium leading-none">System Permissions</h4>
        <p className="text-sm text-muted-foreground mb-2">Define system permissions for a permission group.</p>
      </div>
      <div id="entry_perm_settings" className="flex w-full gap-x-5">
        {showPermGroups && (
          <fieldset id="perm_groups" className="flex w-full max-w-md flex-col gap-6">
            <legend className="text-lg font-medium leading-none mb-5">Permission Groups</legend>
            {permGroups?.map((permGroup) => (
              <Item
                key={`pg-${permGroup.slug}`}
                variant="outline"
                className={selected.permission_group_sys === permGroup.slug ? "bg-primary text-white" : ""}>
                <ItemContent>
                  <ItemTitle>{permGroup.name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setSelected({ ...selected, permission_group_sys: permGroup.slug })}>
                    <ArrowBigRightDash
                      className={selected.permission_group_sys === permGroup.slug ? "text-secondary-foreground" : ""}
                    />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </fieldset>
        )}

        <fieldset id="sys_features" className="flex w-full max-w-md flex-col gap-6">
          <legend className="text-lg font-medium leading-none mb-5">Features</legend>
          {SYSTEM_FEATURES.map((feature) => (
            <Item
              key={`feat-${feature}`}
              variant="outline"
              className={selected.feature === feature ? "bg-primary text-white" : ""}>
              <ItemContent>
                <ItemTitle>{feature}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button variant="outline" size="sm" type="button" onClick={() => setSelected({ ...selected, feature })}>
                  <ArrowBigRightDash className={selected.feature === feature ? "text-secondary-foreground" : ""} />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </fieldset>
        <fieldset className="flex flex-col w-full gap-y-5 ml-3">
          <legend className="text-lg font-medium leading-none mb-5">Privileges</legend>

          {/* List */}
          <form.Field name={`${sysFieldPrefix}.list`}>
            {(field) => (
              <FieldLabel className="col-span-3" htmlFor={`${sysFieldPrefix}.read`}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle className="flex gap-1 items-center">
                      <EyeOpenIcon size={14} />
                      <span>List</span>
                    </FieldTitle>
                    <FieldDescription>
                      Allow the users of this permission group to display data table of this feature.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={!!field.state.value}
                    onCheckedChange={(checked) => {
                      field.handleChange(checked)
                      // Task 5: If Read is disabled, disable CUD
                      if (!checked) {
                        form.setFieldValue(`${sysFieldPrefix}.read`, false)
                        form.setFieldValue(`${sysFieldPrefix}.create`, false)
                        form.setFieldValue(`${sysFieldPrefix}.update`, false)
                        form.setFieldValue(`${sysFieldPrefix}.delete`, false)
                      }
                    }}
                  />
                </Field>
              </FieldLabel>
            )}
          </form.Field>

          {/* Read */}
          <form.Field name={`${sysFieldPrefix}.read`}>
            {(field) => (
              <FieldLabel className="col-span-3" htmlFor={`${sysFieldPrefix}.read`}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle className="flex gap-1 items-center">
                      <EyeOpenIcon size={14} />
                      <span>
                        {sysFieldPrefix === "system.entry-types" || sysFieldPrefix === "system.entries"
                          ? "Read All"
                          : "Read"}
                      </span>
                    </FieldTitle>
                    <FieldDescription>
                      Allow the users of this permission group to read all data of this feature.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={!!field.state.value}
                    onCheckedChange={(checked) => {
                      field.handleChange(checked)
                      // Task 5: If Read is disabled, disable CUD
                      if (!checked) {
                        form.setFieldValue(`${sysFieldPrefix}.create`, false)
                        form.setFieldValue(`${sysFieldPrefix}.update`, false)
                        form.setFieldValue(`${sysFieldPrefix}.delete`, false)
                      }
                    }}
                  />
                </Field>
              </FieldLabel>
            )}
          </form.Field>

          {/* Create */}
          <form.Field name={`${sysFieldPrefix}.read`}>
            {(readField) => (
              <form.Field name={`${sysFieldPrefix}.create`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${sysFieldPrefix}.create`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <Pencil size={14} />
                          <span> {sysFieldPrefix === "system.entries" ? "Create All " : "Create"}</span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to create in this feature.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        disabled={!readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>

          {/* Update */}
          <form.Field name={`${sysFieldPrefix}.read`}>
            {(readField) => (
              <form.Field name={`${sysFieldPrefix}.update`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${sysFieldPrefix}.update`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <RefreshCcw size={14} />
                          <span>
                            {sysFieldPrefix === "system.entry-types" || sysFieldPrefix === "system.entries"
                              ? "Update All"
                              : "Update"}
                          </span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to update in this feature.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        disabled={!readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>

          {/* Delete */}
          <form.Field name={`${sysFieldPrefix}.read`}>
            {(readField) => (
              <form.Field name={`${sysFieldPrefix}.delete`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${sysFieldPrefix}.delete`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <Trash2 size={14} />
                          <span>
                            {sysFieldPrefix === "system.entry-types" || sysFieldPrefix === "system.entries"
                              ? "Delete All"
                              : "Delete"}
                          </span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to delete in this feature.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        disabled={!readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>
        </fieldset>
      </div>

      {/* ===== Entry Permissions (Namespaces) ===== */}
      <div id="entry_perm_title" className="flex flex-col gap-y-1">
        <h4 className="text-xl font-medium leading-none">Entry Permissions</h4>
        <p className="text-sm text-muted-foreground mb-2">Define privileges of namespaces for a permission group.</p>
      </div>
      <div id="entry_perm_settings" className="flex w-full gap-x-5">
        {showPermGroups && (
          <fieldset id="perm_groups" className="flex w-full max-w-md flex-col gap-6">
            <legend className="text-lg font-medium leading-none mb-5">Permission Groups</legend>
            {permGroups?.map((permGroup) => (
              <Item
                key={`ns-pg-${permGroup.slug}`}
                variant="outline"
                className={selected.permission_group_ns === permGroup.slug ? "bg-primary text-white" : ""}>
                <ItemContent>
                  <ItemTitle>{permGroup.name}</ItemTitle>
                </ItemContent>
                <ItemActions>
                  <Button
                    variant="outline"
                    size="sm"
                    type="button"
                    onClick={() => setSelected({ ...selected, permission_group_ns: permGroup.slug })}>
                    <ArrowBigRightDash
                      className={selected.permission_group_ns === permGroup.slug ? "text-secondary-foreground" : ""}
                    />
                  </Button>
                </ItemActions>
              </Item>
            ))}
          </fieldset>
        )}

        <fieldset id="namespaces" className="flex w-full max-w-md flex-col gap-6">
          <legend className="text-lg font-medium leading-none mb-5">Namespaces</legend>
          {/* Namespaces would be dynamically loaded; placeholder items shown */}
          {namespaces.map((ns) => (
            <Item
              key={`ns-${ns.slug}`}
              variant="outline"
              className={selected.namespace === ns.namespace ? "bg-primary text-white" : ""}>
              <ItemContent>
                <ItemTitle>{ns.name}</ItemTitle>
              </ItemContent>
              <ItemActions>
                <Button
                  variant="outline"
                  size="sm"
                  type="button"
                  onClick={() => setSelected({ ...selected, namespace: ns.namespace })}>
                  <ArrowBigRightDash
                    className={selected.namespace === ns.namespace ? "text-secondary-foreground" : ""}
                  />
                </Button>
              </ItemActions>
            </Item>
          ))}
        </fieldset>

        {/* Namespace Privileges — Task 6: gated by Entry Types + Entries Read */}
        <fieldset className="flex flex-col w-full gap-y-5 ml-3">
          <legend className="text-lg font-medium leading-none mb-5">Privileges</legend>

          {!nsEnabled && (
            <p
              className={`flex justify-center items-center p-3 gap-3 bg-amber-400/50 dark:bg-amber-800 text-sm warning-card`}>
              <TriangleAlert size={64} />
              <span>Enable Read privilege for Entry Types and Entries features to modify namespace privileges.</span>
            </p>
          )}

          {/* Read */}
          <form.Field name={`${nsFieldPrefix}.read`}>
            {(field) => (
              <FieldLabel className="col-span-3" htmlFor={`${nsFieldPrefix}.read`}>
                <Field orientation="horizontal">
                  <FieldContent>
                    <FieldTitle className="flex gap-1 items-center">
                      <EyeOpenIcon size={14} />
                      <span>Read</span>
                    </FieldTitle>
                    <FieldDescription>
                      Allow the users of this permission group to read this namespace.
                    </FieldDescription>
                  </FieldContent>
                  <Switch
                    checked={!!field.state.value}
                    onCheckedChange={(checked) => {
                      field.handleChange(checked)
                      if (!checked) {
                        form.setFieldValue(`${nsFieldPrefix}.create`, false)
                        form.setFieldValue(`${nsFieldPrefix}.update`, false)
                        form.setFieldValue(`${nsFieldPrefix}.delete`, false)
                        form.setFieldValue(`${nsFieldPrefix}.read-entry`, false)
                        form.setFieldValue(`${nsFieldPrefix}.update-entry`, false)
                        form.setFieldValue(`${nsFieldPrefix}.delete-entry`, false)
                      }
                    }}
                    disabled={!nsEnabled}
                  />
                </Field>
              </FieldLabel>
            )}
          </form.Field>

          {/* Read Entry */}
          <form.Field name={`${nsFieldPrefix}.read`}>
            {(readField) => (
              <form.Field name={`${nsFieldPrefix}.read-entry`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${nsFieldPrefix}.read-entry`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <Pencil size={14} />
                          <span>Read Entries</span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to read entries in this namespace.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => {
                          field.handleChange(checked)
                          if (!checked) {
                            form.setFieldValue(`${nsFieldPrefix}.create`, false)
                            form.setFieldValue(`${nsFieldPrefix}.update-entry`, false)
                            form.setFieldValue(`${nsFieldPrefix}.delete-entry`, false)
                          }
                        }}
                        disabled={!nsEnabled || !readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>

          {/* Create */}
          <form.Field name={`${nsFieldPrefix}.read`}>
            {(readField) => (
              <form.Field name={`${nsFieldPrefix}.create`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${nsFieldPrefix}.create`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <Pencil size={14} />
                          <span>Create Entries</span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to create entries in this namespace.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        disabled={!nsEnabled || !readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>

          {/* Update */}
          <form.Field name={`${nsFieldPrefix}.read`}>
            {(readField) => (
              <form.Field name={`${nsFieldPrefix}.update`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${nsFieldPrefix}.update`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <RefreshCcw size={14} />
                          <span>Update</span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to update this namespace.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        disabled={!nsEnabled || !readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>

          {/* Update Entry */}
          <form.Field name={`${nsFieldPrefix}.read-entry`}>
            {(readField) => (
              <form.Field name={`${nsFieldPrefix}.update-entry`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${nsFieldPrefix}.update-entry`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <RefreshCcw size={14} />
                          <span>Update Entry</span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to update entries in this namespace.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        disabled={!nsEnabled || !readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>

          {/* Delete */}
          <form.Field name={`${nsFieldPrefix}.read-entry`}>
            {(readField) => (
              <form.Field name={`${nsFieldPrefix}.delete-entry`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${nsFieldPrefix}.delete-entry`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <Trash2 size={14} />
                          <span>Delete Entries</span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to delete entries in this namespace.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        disabled={!nsEnabled || !readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>

          {/* Delete All */}
          <form.Field name={`${nsFieldPrefix}.read`}>
            {(readField) => (
              <form.Field name={`${nsFieldPrefix}.delete`}>
                {(field) => (
                  <FieldLabel className="col-span-3" htmlFor={`${nsFieldPrefix}.delete`}>
                    <Field orientation="horizontal">
                      <FieldContent>
                        <FieldTitle className="flex gap-1 items-center">
                          <Trash2 size={14} />
                          <span>Delete All</span>
                        </FieldTitle>
                        <FieldDescription>
                          Allow the users of this permission group to delete this namespace and its entries.
                        </FieldDescription>
                      </FieldContent>
                      <Switch
                        checked={!!field.state.value}
                        onCheckedChange={(checked) => field.handleChange(checked)}
                        disabled={!nsEnabled || !readField.state.value}
                      />
                    </Field>
                  </FieldLabel>
                )}
              </form.Field>
            )}
          </form.Field>
        </fieldset>
      </div>

      {/* @ts-ignore */}
      <FormSubmitResetBtn form={form} />
    </div>
  )
}

/** Helper to access nested values by dot-separated path */
function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((acc, key) => acc?.[key], obj)
}

export default PrivilegesSettings
