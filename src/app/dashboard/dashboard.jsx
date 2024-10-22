"use client";

import { useCallback, useState, useTransition } from "react";
import { Button } from "../../components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../../components/ui/table";
import { Switch } from "../../components/ui/switch";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Check, X, Eye, Droplet, Loader2, Mail } from "lucide-react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../../components/ui/drawer";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog";
import { useSearchParams, useRouter } from "next/navigation";
import { markVerify, markEmail } from "./actions";

export default function Dashboard({ data }) {
  const [selectedUser, setSelectedUser] = useState(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isFilterPending, startFilterTransition] = useTransition();
  const [verifyLoadingStates, setVerifyLoadingStates] = useState({});
  const [emailLoadingStates, setEmailLoadingStates] = useState({});
  const [verifiedUsers, setVerifiedUsers] = useState({});
  const [emailSentUsers, setEmailSentUsers] = useState({});

  const router = useRouter();
  const searchParams = useSearchParams();
  const isFiltered = searchParams.get("filter") === "verified";

  const setIsFiltered = useCallback(
    (checked) => {
      startFilterTransition(() => {
        const params = new URLSearchParams(searchParams);
        params.set("page", "1");
        if (checked) {
          params.set("filter", "verified");
        } else {
          params.delete("filter");
        }
        router.push(`?${params.toString()}`);
      });
    },
    [searchParams, router]
  );

  const handleVerifyStatus = async (id, status, name) => {
    if (verifyLoadingStates[id]) return;

    setVerifyLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      const result = await markVerify(status, id);

      if (result) {
        setVerifiedUsers((prev) => ({ ...prev, [id]: status }));
        alert(`Successfully ${status ? "verified" : "unverified"} ${name}`);
      } else {
        console.error(`Failed to update verification status for ${name}`);
      }
    } catch (error) {
      alert(`Error updating verification status: ${error}`);
    } finally {
      setVerifyLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const handleSendEmails = async (id, email) => {
    if (emailLoadingStates[id]) return;

    setEmailLoadingStates((prev) => ({ ...prev, [id]: true }));

    try {
      const result = await markEmail(email, id);

      if (result) {
        setEmailSentUsers((prev) => ({ ...prev, [id]: true }));
        alert("Email sent successfully");
      } else {
        alert("Failed to send email");
      }
    } catch (error) {
      alert(`Error sending email: ${error}`);
    } finally {
      setEmailLoadingStates((prev) => ({ ...prev, [id]: false }));
    }
  };

  const isUserVerified = (user) => {
    return user.isVerified || verifiedUsers[user.$id];
  };

  const isEmailSent = (user) => {
    return user.isEmailSent || emailSentUsers[user.$id];
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">User Dashboard</h1>
        <div className="flex items-center space-x-2">
          <span>Filter Verified</span>
          <Switch
            checked={isFiltered}
            onCheckedChange={setIsFiltered}
            disabled={isFilterPending}
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Image</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Transaction ID</TableHead>
            <TableHead>Verify</TableHead>
            <TableHead>View</TableHead>
            <TableHead>Email</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((user) => (
            <TableRow key={user.$id}>
              <TableCell>
                <Avatar>
                  <AvatarImage src={user.paymentScreenshot} alt={user.name} />
                  <AvatarFallback>
                    {user.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{user.name}</TableCell>
              <TableCell>{user.email}</TableCell>
              <TableCell>{user.whatsappNumber}</TableCell>
              <TableCell>{user.upiTransactionId}</TableCell>
              <TableCell>
                <Button
                  variant={isUserVerified(user) ? "default" : "outline"}
                  size="sm"
                  disabled={verifyLoadingStates[user.$id]}
                  onClick={() =>
                    handleVerifyStatus(
                      user.$id,
                      !isUserVerified(user),
                      user.name
                    )
                  }
                  className="min-w-[100px]"
                >
                  {verifyLoadingStates[user.$id] ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Loading
                    </>
                  ) : (
                    <>
                      {isUserVerified(user) ? (
                        <Check className="mr-2 h-4 w-4" />
                      ) : (
                        <X className="mr-2 h-4 w-4" />
                      )}
                      {isUserVerified(user) ? "Verified" : "Verify"}
                    </>
                  )}
                </Button>
              </TableCell>
              <TableCell>
                <Drawer>
                  <DrawerTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedUser(user)}
                    >
                      <Eye className="mr-2 h-4 w-4" />
                      View
                    </Button>
                  </DrawerTrigger>
                  <DrawerContent>
                    <div className="mx-auto w-full max-w-sm">
                      <DrawerHeader>
                        <DrawerTitle>User Details</DrawerTitle>
                        <DrawerDescription>
                          View detailed information about the user.
                        </DrawerDescription>
                      </DrawerHeader>
                      {selectedUser && (
                        <div className="p-4 pb-0">
                          <div className="flex justify-center mb-4">
                            <Dialog
                              open={isImageModalOpen}
                              onOpenChange={setIsImageModalOpen}
                            >
                              <DialogTrigger asChild>
                                <div className="relative cursor-pointer group">
                                  <img
                                    src={selectedUser.paymentScreenshot}
                                    alt={selectedUser.name}
                                    className="rounded-full w-48 h-48 object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <Droplet className="text-white w-8 h-8" />
                                  </div>
                                </div>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                  <DialogTitle>{selectedUser.name}</DialogTitle>
                                  <DialogDescription>
                                    Payment Screenshot
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="mt-4">
                                  <img
                                    src={selectedUser.paymentScreenshot}
                                    alt={selectedUser.name}
                                    className="w-full h-auto rounded-lg"
                                  />
                                </div>
                              </DialogContent>
                            </Dialog>
                          </div>
                          <div className="space-y-4">
                            <div>
                              <h3 className="font-semibold">Name</h3>
                              <p>{selectedUser.name}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold">Email</h3>
                              <p>{selectedUser.email}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold">Phone</h3>
                              <p>{selectedUser.whatsappNumber}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold">Transaction ID</h3>
                              <p>{selectedUser.upiTransactionId}</p>
                            </div>
                            <div>
                              <h3 className="font-semibold">
                                Verification Status
                              </h3>
                              <p>
                                {isUserVerified(selectedUser)
                                  ? "Verified"
                                  : "Not Verified"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                      <DrawerFooter>
                        <DrawerClose asChild>
                          <Button variant="outline">Close</Button>
                        </DrawerClose>
                        {selectedUser && (
                          <Button
                            disabled={
                              emailLoadingStates[selectedUser.$id] ||
                              isEmailSent(selectedUser)
                            }
                            onClick={() =>
                              handleSendEmails(
                                selectedUser.$id,
                                selectedUser.email
                              )
                            }
                          >
                            {emailLoadingStates[selectedUser.$id] ? (
                              <>
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                Sending...
                              </>
                            ) : isEmailSent(selectedUser) ? (
                              <>
                                <Check className="mr-2 h-4 w-4" />
                                Email Sent
                              </>
                            ) : (
                              <>
                                <Mail className="mr-2 h-4 w-4" />
                                Send Email
                              </>
                            )}
                          </Button>
                        )}
                      </DrawerFooter>
                    </div>
                  </DrawerContent>
                </Drawer>
              </TableCell>
              <TableCell>
                {isEmailSent(user) ? (
                  <span>Email sent</span>
                ) : (
                  <Button
                    variant={isEmailSent(user) ? "default" : "outline"}
                    size="sm"
                    disabled={emailLoadingStates[user.$id]}
                    onClick={() => handleSendEmails(user.$id, user.email)}
                    className="min-w-[100px]"
                  >
                    {emailLoadingStates[user.$id] ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Sending...
                      </>
                    ) : (
                      <>Send Email</>
                    )}
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
